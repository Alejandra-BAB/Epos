package com.exodec.cardpay;
import gnu.io.*;
import gnu.io.CommPort;
import gnu.io.CommPortIdentifier;
import gnu.io.SerialPort;
//import jssc.SerialPort;
//import jssc.SerialPortException;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
//import javafx.*;
import java.util.*;
//import javax.comm.*;
import java.util.Arrays;
import java.util.List;
import java.util.logging.*;
import org.json.*;

class Driver {
    private final String[] ascii_names = {"NUL", "SOH", "STX", "ETX", "EOT", "ENQ", "ACK", "BEL", "BS", "HT", "LF", "VT", "FF", "CR", "SO", "SI", "DLE", "DC1", "DC2", "DC3", "DC4", "NAK", "SYN", "ETB", "CAN", "EM", "SUB", "ESC", "FS", "GS", "RS", "US", "SP"};
    private final String[] ascii_val = {"\\x00", "\\x01", "\\x02", "\\x03", "\\x04", "\\x05", "\\x06", "\\x07", "\\x08", "\\t", "\\n", "\\x0b", "\\x0c", "\\r", "\\x0e", "\\x0f", "\\x10", "\\x11", "\\x12", "\\x13", "\\x14", "\\x15", "\\x16", "\\x17", "\\x18", "\\x19", "\\x1a", "\\x1b", "\\x1c", "\\x1d", "\\x1e", "\\x1f", " "};
    private String deviceName = "COM9";
    private int deviceRate = 9600;
    //private Boolean serial = false;
    //private SerialPort serial;
    Logger logger = Logger.getLogger(Driver.class.getName());
    public String[] getAscii_names() { return ascii_names; }

    public String[] getAscii_val() {
        return ascii_val;
    }

    public String getDeviceName() {
        return deviceName;
    }

    public int getDeviceRate() {
        return deviceRate;
    }

    /*public SerialPort getSerial() { return serial; }*/

    public void setDeviceRate(int deviceRate) {
        this.deviceRate = deviceRate;
    }

    /*public void setSerial(SerialPort serial) {this.serial = serial; }*/

    public void setDeviceName(String deviceName) {
        this.deviceName = deviceName;
    }

    public void serial_write(String t) { //throws SerialPortException {
        //serial.writeBytes(t.getBytes());
        System.out.println("."+ t + ". sent to port.");
    }

    public boolean initialize_msg() { //final// throws SerialPortException {
        int max_attempt = 3;
        int attempt_nr = 0;

        while(attempt_nr < max_attempt) {
            ++attempt_nr;
            this.send_one_byte_signal("ENQ");
            if (this.get_one_byte_answer("ACK")) {
                return true;
            }
            logger.log(Level.WARNING, "Terminal : SAME PLAYER TRY AGAIN");
            //System.out.println("Terminal : SAME PLAYER TRY AGAIN");
            this.send_one_byte_signal("EOT");
            try {
                Thread.sleep(1000);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
        return false;
    }

    public void send_one_byte_signal(String signal) { //throws SerialPortException {
        List<String> aNames = Arrays.asList(ascii_names);
        assert !aNames.contains(signal) : "Wrong signal";
        /*
        if (!aNames.contains(signal)) {
            logger.log(Level.SEVERE, "Wrong signal");
            //System.out.println("Wrong signal");
        }*/

        int index = aNames.indexOf(signal);
        String cChar = this.ascii_val[index];
        this.serial_write(cChar);
        logger.log(Level.FINE, "Signal " + signal + " sent to terminal");
        //System.out.println("Signal " + signal + " sent to terminal");
    }

    public boolean get_one_byte_answer(String expected_signal) {//throws SerialPortException {
        List<String> aNames = Arrays.asList(ascii_names);
        String one_byte_read = " ";//serial.readBytes(1).toString();
        int expected_char = aNames.indexOf(expected_signal);
        if (one_byte_read == this.ascii_val[expected_char]) {
            logger.log(Level.FINE, expected_signal + " received from terminal");
            //System.out.println(expected_signal + " received from terminal");
            return true;
        } else {
            return false;
        }
    }

    public final JSONObject prepare_data_to_send(JSONObject payment_info_dict) {
        double amount = Double.valueOf (payment_info_dict.get("amount").toString());
        char payment_mode;
        String pMode = payment_info_dict.get("payment_mode").toString();
        if (pMode.equals("check")) {
            payment_mode = 'C';
        }
        else if (pMode.equals("card")) {
            payment_mode = '1';
        }
        else {
            payment_mode = ' ';
            logger.log(Level.SEVERE, "The payment mode '" + pMode + "' is not supported");
            //System.out.println("The payment mode '" + pMode + "' is not supported");
            //return false;
        }

        double base = 10.0D;
        double cur_fact = amount*base*base;
        String cur_numeric = "840";
        String amt_msg = "        " + String.format("%.0f", cur_fact);

        JSONObject data = new JSONObject();
        data.put("pos_number", "01");
        data.put("answer_flag", "0");
        data.put("transaction_type", "0");
        data.put("payment_mode", payment_mode);
        data.put("currency_numeric", "   "+cur_numeric);
        data.put("private", "          ");
        data.put("delay", "A011");
        data.put("auto", "B010");
        data.put("amount_msg", amt_msg);
        return data;
    }

    public int generate_lrc(String real_msg_with_etx) {
        int lrc = 0;
        char[] cArr = real_msg_with_etx.toCharArray();
        int arrLen = cArr.length;
        for(int i = 0; i < arrLen; ++i) {
            char c = cArr[i];
            lrc ^= c;
        }
        return lrc;
    }

    public void send_message(JSONObject data) { //throws SerialPortException {
        String real_msg = "" + data.get("pos_number") + data.get("amount_msg") + data.get("answer_flag") + data.get("payment_mode") + data.get("transaction_type") + data.get("currency_numeric") + data.get("private") + data.get("delay") + data.get("auto");
        logger.log(Level.FINE, "Real message to send = " + real_msg);
        //System.out.println("Real message to send = " + real_msg);
        assert real_msg.length() != 34 : "Wrong length for protocol E+";
        /*
        if (real_msg.length() != 34) {
            //System.out.println("Wrong length for protocol E+");
            logger.log(Level.SEVERE, "Wrong length for protocol E+");
        }*/

        String real_msg_with_etx = real_msg + "";
        int lrc = this.generate_lrc(real_msg_with_etx);
        real_msg_with_etx = real_msg_with_etx + "\\x03";
        lrc ^= 3;
        String lrcChar = this.ascii_val[lrc];
        String message = "\\x02" + real_msg_with_etx + lrcChar;
        this.serial_write(message);
        logger.log(Level.INFO, "Message sent to terminal");
        //System.out.println("Message sent to terminal");
    }

    public void compare_data_vs_answer(JSONObject data, JSONObject answer_data) {
        String[] searchArr = new String[]{"pos_number", "amount_msg", "currency_numeric", "private"};
        int arrLen = searchArr.length;

        for(int i = 0; i < arrLen; ++i) {
            String field = searchArr[i];
            String df = "" + data.get(field);
            String adf = "" + answer_data.get(field);
            if (df != adf) {
                logger.log(Level.WARNING, "Field " + field + " has value '" + df + "' in data and value '" + adf + "' in answer");
                //System.out.println("Field " + field + " has value '" + df + "' in data and value '" + adf + "' in answer");
            }
        }
    }

    public JSONObject parse_terminal_answer(String real_msg, JSONObject data) {
        JSONObject answer_data = new JSONObject();
        answer_data.put("pos_number", real_msg.substring(0, 2));
        answer_data.put("transaction_result", real_msg.substring(2));
        answer_data.put("amount_msg", real_msg.substring(3, 11));
        answer_data.put("payment_mode", real_msg.substring(11));
        answer_data.put("currency_numeric", real_msg.substring(12, 15));
        answer_data.put("private", real_msg.substring(15, 26));
        logger.log(Level.FINE, "answer_data = " + answer_data);
        //System.out.println("answer_data = " + answer_data);
        this.compare_data_vs_answer(data, answer_data);
        return answer_data;
    }

    public JSONObject get_answer_from_terminal(JSONObject data) { //throws SerialPortException {
        List<String> aNames = Arrays.asList(ascii_names);
        int full_msg_size = 1 + 2 + 1 + 8 + 1 + 3 + 10 + 1 + 1;
        String msg = " ";//serial.readBytes(full_msg_size).toString();
        int msgLen = msg.length();
        logger.log(Level.FINE, full_msg_size + " bytes read from terminal");
        //System.out.println(full_msg_size + " bytes read from terminal");
        assert msgLen != full_msg_size : "Answer has a wrong size";
        /*if(msgLen != full_msg_size) {
            logger.log(Level.SEVERE, "Answer has a wrong size");
            //System.out.println("Answer has a wrong size");
        }*/
        if (msg.substring(0) != "STX") {       //chr(ascii_names.index('STX'))
            logger.log(Level.SEVERE, "The first byte of the answer from terminal should be STX");
            //System.out.println("The first byte of the answer from terminal should be STX");
        }
        if (msg.substring(msg.length()-2) != "ETX") {          //chr(ascii_names.index('ETX'))
            logger.log(Level.SEVERE, "The byte before final of the answer from terminal should be ETX");
            //System.out.println("The byte before final of the answer from terminal ");
            //System.out.println("should be ETX");
        }
        int lrc = Integer.parseInt(msg.substring(msg.length()-1));//takeLast(1)
        int computed_lrc = aNames.indexOf( ascii_val[generate_lrc(msg.substring(1, msgLen-1))]);
        if (computed_lrc != lrc) {
            logger.log(Level.SEVERE, "The LRC of the answer from terminal is wrong");
            //System.out.println("The LRC of the answer from terminal is wrong");
        }
        String real_msg = msg.substring(1, msgLen-2);
        logger.log(Level.FINE, "Real answer received = "+real_msg);
        //System.out.println("Real answer received = $real_msg");
        return parse_terminal_answer(real_msg, data);
    }

    public void transaction_start(String payment_info) throws Exception {
        logger.log(Level.FINE, "starting trans_start");
        JSONObject payment_info_dict = new JSONObject(payment_info);
        //Map payment_info_dict = toJson(payment_info);
        JSONObject data = new JSONObject();
        /*if (!payment_info_dict is Map)
            System.out.println("payment_info_dict should be a dict");*/
        logger.log(Level.FINE, "payment_info_dict = " + payment_info_dict);
        //System.out.println("payment_info_dict = " + payment_info_dict);
        try {

            try {
                logger.log(Level.FINE, "Opening serial port " + deviceName + "for payment terminal with baudrate " + deviceRate);
                //System.out.println("Opening serial port " + deviceName + "for payment terminal with baudrate " + deviceRate);
                //serial = new SerialPort(deviceName);//serial = Serial(device_name, device_rate, timeout = 3)
                //serial.openPort();
                //serial.setParams(deviceRate, 8, 1, 0);
            }
            catch ( Exception err){//SerialPortException err) {
                System.err.println(err);
            }
            //logger.debug('serial.is_open = %s' % self.serial.isOpen())
            //System.out.println("serial.isClosed = "+ serial.isClosed());

            if (initialize_msg()) {
                data = prepare_data_to_send(payment_info_dict);
            }
            if (data == null || data.isEmpty()){
                return ;}
            send_message(data);
            if (get_one_byte_answer("ACK")){
                send_one_byte_signal("EOT");}
            //logger.info("Now expecting answer from Terminal")
            logger.log(Level.INFO, "Now expecting answer from Terminal");
            //System.out.println("Now expecting answer from Terminal");
            if (get_one_byte_answer("ENQ")){
                send_one_byte_signal("ACK");}
            get_answer_from_terminal(data);
            send_one_byte_signal("ACK");
            if (get_one_byte_answer("EOT")){
                logger.log(Level.INFO, "Answer received from Terminal");
                //System.out.println("Answer received from Terminal");
            }

            //logger.info("Answer received from Terminal")
        } catch (Exception e){
            logger.log(Level.SEVERE,"Exception in serial connection: " + e);
            //System.out.println("Exception in serial connection: " + e);
            throw e;//raise
        } finally {
            /*
            if (serial != null) {
                logger.log(Level.FINE, "Closing serial port for payment terminal");
                //System.out.println("Closing serial port for payment terminal");
                serial.closePort();
            }

             */
        }
    }
}

class SerialPortHandler {
    private SerialPort serialPort;
    public OutputStream outStream;
    public InputStream inStream;

    public void connect(String portName) throws IOException {
        try {
            // Obtain a CommPortIdentifier object for the port you want to open
            CommPortIdentifier portId = CommPortIdentifier.getPortIdentifier(portName);
            // Get the port's ownership
            serialPort = (SerialPort) portId.open("Card Pay", 5000);
            // Set the parameters of the connection.
            setSerialPortParameters();
            // Open the input and output streams for the connection. If they won't
            // open, close the port before throwing an exception.
            outStream = serialPort.getOutputStream();
            inStream = serialPort.getInputStream();
        } catch (NoSuchPortException e) {
            throw new IOException(e.getMessage());
        } catch (PortInUseException e) {
            throw new IOException(e.getMessage());
        } catch (IOException e) {
            serialPort.close();
            throw e;
        }
    }

    public InputStream getSerialInputStream() {
        return inStream;
    }

    public OutputStream getSerialOutputStream() {
        return outStream;
    }
    public void portWriter(String send) {
        try {
            outStream.write(send.getBytes());
            outStream.flush();
        } catch (IOException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
    }
    private void setSerialPortParameters() throws IOException {
        try {
            // Set serial port to 57600bps-8N1..my favourite
            serialPort.setSerialPortParams(
                    9600,
                    SerialPort.DATABITS_8,
                    SerialPort.STOPBITS_1,
                    SerialPort.PARITY_NONE);

            serialPort.setFlowControlMode(
                    SerialPort.FLOWCONTROL_NONE);
        } catch (UnsupportedCommOperationException ex) {
            throw new IOException("Unsupported serial port parameter");
        }
    }
}
class SerialCom {
    OutputStream outs;
    InputStream ins;
    SerialPort serialPort;

    void connect(String portName) throws Exception {
        CommPortIdentifier portIdentifier = CommPortIdentifier.getPortIdentifier(portName);
        if (portIdentifier.isCurrentlyOwned()) {
            System.out.println("Error: Port is currently in use");
        } else {
            CommPort commPort = portIdentifier.open("Card Pay", 2000);

            if (commPort instanceof SerialPort) {
                serialPort = (SerialPort) commPort;//SerialPort
                serialPort.setSerialPortParams(9600, SerialPort.DATABITS_8, SerialPort.STOPBITS_1, SerialPort.PARITY_NONE);

                InputStream in = serialPort.getInputStream();
                OutputStream out = serialPort.getOutputStream();
                outs = out;
                ins = in;
                (new Thread(new SerialReader(in))).start();
                (new Thread(new SerialWriter(out))).start();

            } else {
                System.out.println("Error: Only serial ports are handled by this example.");
            }
        }
    }

    public static class SerialReader implements Runnable {
        InputStream in;

        public SerialReader(InputStream in) {
            this.in = in;
        }

        public void run() {
            byte[] buffer = new byte[1024];
            int len = -1;
            try {
                while ((len = this.in.read(buffer)) > -1) {
                    System.out.print(new String(buffer, 0, len));
                }
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }

    public static class SerialWriter implements Runnable {
        OutputStream out;

        public SerialWriter(OutputStream out) {
            this.out = out;
        }

        public void run() {
            try {
                int c = 0;
                while ((c = System.in.read()) > -1) {
                    this.out.write(c);
                }
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }

    public void portWriter(String send) {
        try {
            outs.write(send.getBytes());
            outs.flush();
        } catch (IOException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
    }
}
public class CardPay {
    /*
    public static void main(String[] args) throws Exception {
        System.out.println("Howdy");

        //Driver b = new Driver();
        //JSONObject jsonO = new JSONObject("{'amount':12.00, 'payment_mode':'card'}");
        //JSONObject jsonData = b.prepare_data_to_send(jsonO);
        //b.send_message(jsonData);

        //SerialCom a = new SerialCom();
        //a.connect("COM9");
        //a.portWriter("\\x0201        12000490   840          A011B010\\x03\\x12");

        SerialPortHandler a = new SerialPortHandler();
        a.connect("COM9");
        //a.initialize_msg();
        a.portWriter("\\x05");
        //a.inStream.read();
        //Driver a = new Driver();
        //a.transaction_start("{'amount':12.00, 'payment_mode':'check'}");
    }
    */
}
