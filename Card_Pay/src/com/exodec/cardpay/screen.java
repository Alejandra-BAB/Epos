package com.exodec.cardpay;

import javafx.application.Application;
import javafx.scene.Node;
import javafx.scene.control.Button;
import javafx.stage.Stage;
import javafx.scene.Scene;
import javafx.scene.text.Text;
import javafx.scene.text.Font;
import javafx.scene.text.FontPosture;
import javafx.scene.text.FontWeight;
import javafx.scene.layout.GridPane;
import javafx.geometry.Insets;
import javafx.scene.paint.Color;

import java.awt.*;


public class screen extends Application {

    @Override
    public void start(Stage primaryStage) throws Exception{
        primaryStage.setTitle("Charge");
        double amt = 12;
        String amount = "Amount: " + amt;
        GridPane grid = new GridPane();
        grid.setPadding(new Insets(10, 10, 10, 10));
        grid.setVgap(15);
        grid.setHgap(10);

        Text amtTxt = new Text(amount);
        Text amtNum = new Text("");

        Button debitButton = new Button("DEBIT");
        //Button creditButton = new Button("CREDIT");

        amtTxt.setFont(Font.font("arial", FontWeight.THIN, FontPosture.REGULAR, 20.0D));
        amtTxt.setFill(Color.WHITE);
        amtNum.setFont(Font.font("arial", FontWeight.NORMAL, FontPosture.REGULAR, 15.0D));
        amtNum.setFill(Color.WHITE);
        //debitButton.setStyle("-fx-background-color: #00B5FA; -fx-font: 14.5 arial; -fx-text-fill: #fff; -fx-pref-width: 200px; -fx-pref-height: 40px;");
        //creditButton.setStyle("-fx-background-color: #00B5FA; -fx-font: 14.5 arial; -fx-text-fill: #fff; -fx-pref-width: 200px; -fx-pref-height: 40px;");
        grid.setStyle("-fx-background-color: #0175a8;");

        grid.add(amtTxt, 2, 1,1,1);
        grid.add(amtNum, 1, 3,1,1);

        //grid.add(debitButton, 1, 5,1,1);
        //grid.add(creditButton, 3, 5,1,1);

        Scene scene = new Scene(grid, 500, 400);
        primaryStage.setScene(scene);
        primaryStage.show();
    }

    public static void main(String[] args) {
        Application.launch(args);
    }
}

/*////////////
        amtTxt.setFill((Paint)Color.WHITE);
        grid.add((Node)amtTxt, 2, 1);
        debitButton.setOnAction((EventHandler)(new EventHandler() {
            // $FF: synthetic method
            // $FF: bridge method
            public void handle(Event var1) {
                this.handle((ActionEvent)var1);
            }

            public final void handle(ActionEvent $noName_0) {
                text2.setText("Please insert, swipe, or tap your debit card.");
                debitButton.setVisible(false);
                creditButton.setVisible(false);
            }
        }));
        creditButton.setOnAction((EventHandler)(new EventHandler() {
            // $FF: synthetic method
            // $FF: bridge method
            public void handle(Event var1) {
                this.handle((ActionEvent)var1);
            }

            public final void handle(ActionEvent $noName_0) {
                text2.setText("Please insert, swipe, or tap your credit card.");
                debitButton.setVisible(false);
                creditButton.setVisible(false);
            }
        }));


import javafx.application.Application;
import javafx.event.ActionEvent;
import javafx.event.Event;
import javafx.event.EventHandler;
import javafx.scene.Node;
import javafx.scene.Parent;
import javafx.scene.control.Label;
import javafx.scene.paint.Paint;
import javafx.stage.Stage;
import javafx.scene.Scene;
import javafx.scene.control.Button;
import javafx.scene.layout.StackPane;
import javafx.scene.control.TextField;
import javafx.scene.text.Text;
import javafx.scene.text.Font;
import javafx.scene.text.FontPosture;
import javafx.scene.text.FontWeight;
import javafx.scene.layout.GridPane;
import javafx.beans.binding.Bindings;
import javafx.geometry.Insets;
import javafx.geometry.Pos;
import javafx.scene.control.ToggleButton;
import javafx.scene.layout.Background;
import javafx.scene.layout.BackgroundFill;
import javafx.scene.layout.BorderPane;
import javafx.scene.layout.CornerRadii;
import javafx.scene.layout.HBox;
import javafx.scene.layout.VBox;
import javafx.scene.paint.Color;
import java.nio.file.FileSystems;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;



public static void main(String[] args) {
        JFrame f=new JFrame("Charge");//creating instance of JFrame
        f.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        f.setBackground(Color.BLUE);
        JButton creditButton=new JButton("CREDIT");//creating instance of JButton
        JButton debitButton=new JButton("DEBIT");
        creditButton.setBounds(130,100,100, 40);//x axis, y axis, width, height
        debitButton.setBounds(250,100,100, 40);
        f.add(creditButton);//adding button in JFrame
        f.add(debitButton);
        f.setSize(400,500);//400 width and 500 height
        f.setLayout(null);//using no layout managers
        f.setVisible(true);//making the frame visible
    }
*/