#include <SPI.h>
#include <Ethernet.h>
#include <Thermistor.h>

#define USE_ARDUINO_INTERRUPTS true    // Set-up low-level interrupts for most acurate BPM math.
#include <PulseSensorPlayground.h>     // Includes the PulseSensorPlayground Library.   

//  Variables
const int PulseWire = 1;       // PulseSensor PURPLE WIRE connected to ANALOG PIN 0
const int LED13 = 13;          // The on-board Arduino LED, close to PIN 13.
int Threshold = 550;           // Determine which Signal to "count as a beat" and which to ignore.
                               // Use the "Gettting Started Project" to fine-tune Threshold Value beyond default setting.
                               // Otherwise leave the default "550" value. 
                               
PulseSensorPlayground pulseSensor;  // Creates an instance of the PulseSensorPlayground object called "pulseSensor"

Thermistor temp(2);

//Configurar a conexão antes de iniciar:
byte mac[] = {
  0xDE, 0xAD, 0xBE, 0xEF, 0xFE, 0xED
};
IPAddress ip(10,10,117,23);
IPAddress subnet(255, 255, 0, 0); 
IPAddress gateway(192,168,42,129);
EthernetServer server(80);

long randNumber;


void setup() {

  Serial.begin(9600);          // For Serial Monitor

  // Configure the PulseSensor object, by assigning our variables to it. 
  pulseSensor.analogInput(PulseWire);   
  pulseSensor.blinkOnPulse(LED13);       //auto-magically blink Arduino's LED with heartbeat.
  pulseSensor.setThreshold(Threshold);   

  // Double-check the "pulseSensor" object was created and "began" seeing a signal. 
   if (pulseSensor.begin()) {
    Serial.println("We created a pulseSensor Object !");  //This prints one time at Arduino power-up,  or on Arduino reset.  
  }

  

  // Open serial communications and wait for port to open:
  Serial.begin(9600);
  while (!Serial) {
    ; // wait for serial port to connect. Needed for native USB port only
  }
  Serial.println("HomeCare Project - Iniciando...");

  // Iniciar a conexão com o Ethernet Shield e o server
  Ethernet.begin(mac, ip);

  randomSeed(analogRead(0));

  // Verificar se o Ethernet está OK
  if (Ethernet.hardwareStatus() == EthernetNoHardware) {
    Serial.println("Ethernet shield was not found.  Sorry, can't run without hardware. :(");
    while (true) {
      delay(1); // impede de rodar sem o Ethernet Shield
    }
  }
  if (Ethernet.linkStatus() == LinkOFF) {
    Serial.println("Ethernet cable is not connected.");
  }

  // Iniciar o  server:
  server.begin();
  Serial.print("Ip do server: ");
  Serial.println(Ethernet.localIP());
}


void loop() {
  randNumber = random(300);
  int temperature = temp.getTemp(); 
  Serial.println(temperature);


 int myBPM = pulseSensor.getBeatsPerMinute();  // Calls function on our pulseSensor object that returns BPM as an "int".
                                               // "myBPM" hold this BPM value now. 

if (pulseSensor.sawStartOfBeat()) {            // Constantly test to see if "a beat happened". 
 Serial.println("♥  A HeartBeat Happened ! "); // If test is "true", print a message "a heartbeat happened".
 Serial.print("BPM: ");                        // Print phrase "BPM: " 
 Serial.println(myBPM);                        // Print the value inside of myBPM. 
}

  delay(20);                    // considered best practice in a simple sketch.

  
  // atendendo os 'clientes'
  EthernetClient client = server.available();
  if (client) {
    Serial.println("new client");
    // Termina a requisição HTTP com uma linha em branco no final
    bool currentLineIsBlank = true;
    while (client.connected()) {
      if (client.available()) {
        char c = client.read();
        Serial.write(c);



        if (c == '\n' && currentLineIsBlank) {
          // Enviar cabeçalhos:
          client.println("HTTP/1.1 200 OK");
          client.println("Content-Type: application/json"); // O server deve retornar um JSON
          client.println("Access-Control-Allow-Origin: *"); // Evita erros de CORS
          client.println("Connection: close"); 


          //Aqui é onde o JSON é criado
          client.println();
          client.print("{\"randomNumber\":");
          client.print(randNumber);
          client.print(",\"temperature\":");
          client.print(temperature) + ",";
          client.print(",\"bpm\":");
          client.print(myBPM) + ",";
          client.print("}");
          break;
        }
        if (c == '\n') {
          currentLineIsBlank = true;
        } else if (c != '\r') {

          currentLineIsBlank = false;
        }
      }
    }
    delay(1);
    // Encerra a conexão 
    client.stop();
    Serial.println("client disconnected");
  }
}
