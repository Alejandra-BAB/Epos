import javafx.application.Application
import javafx.event.ActionEvent
import javafx.event.EventHandler
import javafx.stage.Stage
import javafx.scene.Scene
import javafx.scene.control.Button
import javafx.scene.layout.StackPane
import javafx.scene.control.TextField
import javafx.scene.text.Text
import javafx.scene.text.Font
import javafx.scene.text.FontPosture
import javafx.scene.text.FontWeight
import javafx.scene.layout.GridPane
import javafx.beans.binding.Bindings
import javafx.geometry.Insets
import javafx.geometry.Pos
import javafx.scene.control.ToggleButton
import javafx.scene.layout.Background
import javafx.scene.layout.BackgroundFill
import javafx.scene.layout.BorderPane
import javafx.scene.layout.CornerRadii
import javafx.scene.layout.HBox
import javafx.scene.layout.VBox
import javafx.scene.paint.Color
import java.nio.file.FileSystems
import java.nio.file.Files
import java.nio.file.Path
import java.nio.file.Paths
import java.util.stream.Collectors.toList

/*w  ww.ja v  a  2s.  c  o  m*/
class Main : Application() {

    override fun start(primaryStage: Stage) {
        /*
        val btn = Button()
        btn.text = "Say 'Hello World'"
        btn.onAction = EventHandler<ActionEvent> { println("Hello World!") }

        val root = StackPane()
        root.children.add(btn)
        val scene = Scene(root, 300.0, 250.0)
*/
        val amt = 12.00 //parameters.unnamed[0];
        primaryStage.title = "Charge"

        val grid = GridPane()
        grid.padding = Insets(10.0, 10.0, 10.0, 10.0)
        //grid.setMinSize(500.0, 400.0)
        grid.vgap = 15.0
        grid.hgap = 10.0

        val amtTxt = Text("Amount: $amt")
        amtTxt.font = Font.font("arial", FontWeight.THIN, FontPosture.REGULAR, 20.0);
        amtTxt.fill = Color.WHITE;
        /*Setting the Stroke
        text.setStrokeWidth(2);
        // Setting the stroke color
        text.setStroke(Color.BLUE);*/
        grid.add(amtTxt, 2, 1)

        val text2= Text("")
        text2.font = Font.font("arial", FontWeight.NORMAL, FontPosture.REGULAR, 15.0);
        text2.fill = Color.WHITE;
        grid.add(text2, 1, 3)

        val debitButton = Button("DEBIT")
        debitButton.style = "-fx-background-color: #00B5FA; -fx-font: 14.5 arial; -fx-text-fill: #fff; -fx-pref-width: 200px; -fx-pref-height: 40px;";

        val creditButton = Button("CREDIT")
        creditButton.style = "-fx-background-color: #00B5FA; -fx-font: 14.5 arial; -fx-text-fill: #fff; -fx-pref-width: 200px; -fx-pref-height: 40px;";

        grid.add(debitButton,1,5)
        debitButton.setOnAction { _ ->
            text2.text = "Please insert, swipe, or tap your debit card."
            debitButton.isVisible = false
            creditButton.isVisible = false }

        grid.add(creditButton,3,5)
        creditButton.setOnAction { _ ->
            text2.text = "Please insert, swipe, or tap your credit card."
            debitButton.isVisible = false
            creditButton.isVisible = false }

        grid.style = "-fx-background-color: #0175a8;"

        val scene = Scene(grid, 500.0, 400.0)
        primaryStage.scene = scene
        primaryStage.show()

        /*
        val scene = Scene(root, 400.0, 350.0)
        //if (primaryStage != null) {
            primaryStage.title = "Prepare Payment"
            primaryStage.scene = scene
            primaryStage.show()
        //}*/
        //val dyn: dynamic =
    }
}

fun main(args: Array<String>) {
    Application.launch(Main::class.java, *args)
}


