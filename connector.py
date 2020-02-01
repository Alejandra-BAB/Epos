import json as simplejson
import time
import logging
import curses.ascii
from serial import Serial
import PySimpleGUI
import pycountry
import js2py
#js2py.translate_file('EposnowJSAPI.js', 'EposnowJSAPI.py')
#from EposnowJSAPI import EposnowJSAPI
logger = logging.getLogger(__name__)

class Driver(object):
    def __init__(self, port, rate):
        self.device_name = port
        self.device_rate = rate
        self.serial = False

    def serial_write(self, text):
        assert isinstance(text, str), 'text must be a string'
        self.serial.write(text.encode())

    def initialize_msg(self):
        max_attempt = 3
        attempt_nr = 0
        while attempt_nr < max_attempt:
            attempt_nr += 1
            self.send_one_byte_signal('ENQ')
            if self.get_one_byte_answer('ACK'):
                return True
            else:
                logger.warning("Terminal : SAME PLAYER TRY AGAIN")
                self.send_one_byte_signal('EOT')
                # Wait 1 sec between each attempt
                time.sleep(1)
        return False

    def send_one_byte_signal(self, signal):
        ascii_names = curses.ascii.controlnames
        assert signal in ascii_names, 'Wrong signal'
        char = ascii_names.index(signal)
        self.serial_write(chr(char))
        logger.debug('Signal %s sent to terminal' % signal)

    def get_one_byte_answer(self, expected_signal):
        ascii_names = curses.ascii.controlnames
        one_byte_read = self.serial.read(1)
        expected_char = ascii_names.index(expected_signal)
        if one_byte_read == chr(expected_char):
            logger.debug("%s received from terminal" % expected_signal)
            return True
        else:
            return False

    def prepare_data_to_send(self, payment_info_dict):
        amount = payment_info_dict["amount"]
        if payment_info_dict["payment_mode"] == "check":
            payment_mode = 'C'
        elif payment_info_dict["payment_mode"] == "card":
            payment_mode = '1'
        else:
            logger.error(
                "The payment mode '%s' is not supported"
                % payment_info_dict["payment_mode"])
            return False
        '''
        cur_decimals = payment_info_dict.get('currency_decimals', 2)
        cur_fact = 10 ** cur_decimals
        cur_iso_letter = payment_info_dict['currency_iso'].upper()
        try:
            cur = pycountry.currencies.get(alpha_3=cur_iso_letter)
            cur_numeric = str(cur.numeric)
        except:
            logger.error("Currency %s is not recognized" % cur_iso_letter)
            return False
        '''
        cur_numeric = "840"
        cur_fact = 10 ** 2

        data = {
            'pos_number': str(1).zfill(2),
            'answer_flag': '0',
            'transaction_type': '0',
            'payment_mode': payment_mode,
            'currency_numeric': cur_numeric.zfill(3),
            'private': ' ' * 10,
            'delay': 'A011',
            'auto': 'B010',
            'amount_msg': ('%.0f' % (amount * cur_fact)).zfill(8),
        }
        return data

    def generate_lrc(self, real_msg_with_etx):
        lrc = 0
        for char in real_msg_with_etx:
            lrc ^= ord(char)
        return lrc

    def send_message(self, data):
        '''We use protocol E+'''
        ascii_names = curses.ascii.controlnames
        real_msg = (
                data["pos_number"]
                + data["amount_msg"]
                + data["answer_flag"]
                + data["payment_mode"]
                + data["transaction_type"]
                + data["currency_numeric"]
                + data["private"]
                + data["delay"]
                + data["auto"]
        )
        logger.debug('Real message to send = %s' % real_msg)
        assert len(real_msg) == 34, 'Wrong length for protocol E+'
        real_msg_with_etx = real_msg + chr(ascii_names.index('ETX'))
        lrc = self.generate_lrc(real_msg_with_etx)
        print(ascii_names.index('STX'))
        print(ascii_names.index('ETX'))
        print(lrc)
        message = chr(ascii_names.index('STX')) + real_msg_with_etx + chr(lrc)
        #self.serial_write(message) !!!!
        print(message)
        logger.info('Message sent to terminal')

    def compare_data_vs_answer(self, data, answer_data):
        for field in ["pos_number", "amount_msg", "currency_numeric", "private"]:
            if data[field] != answer_data[field]:
                logger.warning(
                    "Field %s has value '%s' in data and value '%s' in answer"
                    % (field, data[field], answer_data[field]))

    def parse_terminal_answer(self, real_msg, data):
        answer_data = {
            'pos_number': real_msg[0:2],
            'transaction_result': real_msg[2],
            'amount_msg': real_msg[3:11],
            'payment_mode': real_msg[11],
            'currency_numeric': real_msg[12:15],
            'private': real_msg[15:26],
        }
        logger.debug('answer_data = %s' % answer_data)
        self.compare_data_vs_answer(data, answer_data)
        return answer_data

    def get_answer_from_terminal(self, data):
        ascii_names = curses.ascii.controlnames
        full_msg_size = 1 + 2 + 1 + 8 + 1 + 3 + 10 + 1 + 1
        msg = self.serial.read(size=full_msg_size)
        logger.debug('%d bytes read from terminal' % full_msg_size)
        assert len(msg) == full_msg_size, 'Answer has a wrong size'
        if msg[0] != chr(ascii_names.index('STX')):
            logger.error(
                'The first byte of the answer from terminal should be STX')
        if msg[-2] != chr(ascii_names.index('ETX')):
            logger.error(
                'The byte before final of the answer from terminal '
                'should be ETX')
        lrc = msg[-1]
        computed_lrc = chr(self.generate_lrc(msg[1:-1]))
        if computed_lrc != lrc:
            logger.error(
                'The LRC of the answer from terminal is wrong')
        real_msg = msg[1:-2]
        logger.debug('Real answer received = %s' % real_msg)
        return self.parse_terminal_answer(real_msg, data)

    def transaction_start(self, payment_info):
        '''This function sends the data to the serial/usb port.
        '''
        payment_info_dict = payment_info #simplejson.loads(payment_info)
        assert isinstance(payment_info_dict, dict), 'payment_info_dict should be a dict'
        logger.debug("payment_info_dict = %s" % payment_info_dict)
        try:
            logger.debug(
                'Opening serial port %s for payment terminal with baudrate %d'
                % (self.device_name, self.device_rate))
            # IMPORTANT : don't modify timeout=3 seconds
            # This parameter is very important ; the Telium spec say
            # that we have to wait to up 3 seconds to get LRC
            self.serial = Serial(
                self.device_name, self.device_rate,
                timeout=3)
            logger.debug('serial.is_open = %s' % self.serial.isOpen())
            if self.initialize_msg():
                data = self.prepare_data_to_send(payment_info_dict)
                if not data:
                    return
                self.send_message(data)
                if self.get_one_byte_answer('ACK'):
                    self.send_one_byte_signal('EOT')

                    logger.info("Now expecting answer from Terminal")
                    if self.get_one_byte_answer('ENQ'):
                        self.send_one_byte_signal('ACK')
                        self.get_answer_from_terminal(data)
                        self.send_one_byte_signal('ACK')
                        if self.get_one_byte_answer('EOT'):
                            logger.info("Answer received from Terminal")

        except Exception as e:
            logger.error('Exception in serial connection: %s' % str(e))
            raise
        finally:
            if self.serial:
                logger.debug('Closing serial port for payment terminal')
                self.serial.close()


PySimpleGUI.LOOK_AND_FEEL_TABLE['EPOS'] = {'BACKGROUND': '#0175A8',
                                        'TEXT': '#fff4c9',
                                        'INPUT': '#c7e78b',
                                        'TEXT_INPUT': '#000000',
                                        'SCROLL': '#c7e78b',
                                        'BUTTON': ('white', '#00B5FA'),
                                        'PROGRESS': ('#01826B', '#D0D0D0'),
                                        'BORDER': 1, 'SLIDER_DEPTH': 0, 'PROGRESS_DEPTH': 0,
                                        }
PySimpleGUI.theme('EPOS')

layout = [[PySimpleGUI.Text('$', background_color='white', justification='center', size=(10, 1))],
        [PySimpleGUI.Button('1'), PySimpleGUI.Button('2'), PySimpleGUI.Button('3')],
        [PySimpleGUI.Button('4'), PySimpleGUI.Button('5'), PySimpleGUI.Button('6')],
        [PySimpleGUI.Button('7'), PySimpleGUI.Button('8'), PySimpleGUI.Button('9')],
        [PySimpleGUI.Button('.'), PySimpleGUI.Button('0'), PySimpleGUI.Button('DEL')],
        [PySimpleGUI.Button('Debit'), PySimpleGUI.Button('Credit')],
        [PySimpleGUI.Button('Exit')]]
window = PySimpleGUI.Window('Charge', layout, no_titlebar=True)
while True:
    event, values = window.read()
    if event in (None, 'Exit'):
        window.close()
    if event in (None, '1'):
        break
    #print('You entered ', values[0])

a = Driver('COM3', 9600)
data = {"amount": 12.00, "payment_mode": "check"}
ser = Serial('COM9', 9600,timeout=3)
#a.send_message(a.prepare_data_to_send(data))
lnum = a.generate_lrc("0040A000\x03")
print(lnum)
lval = chr(lnum)
print(lval)

#token = "WldIVkRRSVkxODFBTTI0WlMwUEhLSEdLUkhUQU1YSDU6U1ZaWUNaMDgzODJCMTBCSUVBUlVCSTY1M0RVRUpaVDA="
#EposnowJSAPI.setAccessToken(token);
#deviceId = EposnowJSAPI.getDeviceID();
#print(deviceId)
#a.transaction_start(data)
