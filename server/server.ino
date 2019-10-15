#include <SPI.h>
#include <Ethernet.h>


//Configurar a conexão antes de iniciar:
byte mac[] = {
  0xDE, 0xAD, 0xBE, 0xEF, 0xFE, 0xED
};
IPAddress ip(169, 254, 45, 198);
IPAddress subnet(255, 255, 0, 0); 
EthernetServer server(80);

long randNumber;


void setup() {

  // Open serial communications and wait for port to open:
  Serial.begin(9600);
  while (!Serial) {
    ; // wait for serial port to connect. Needed for native USB port only
  }
  Serial.println("Ethernet WebServer Example");

  // start the Ethernet connection and the server:
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

  // Iniciar o  servidor!
  server.begin();
  Serial.print("server is at ");
  Serial.println(Ethernet.localIP());
}


void loop() {

  randNumber = random(300);
  
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


          client.println();
          client.print("{\"number\":");
          client.print(randNumber);
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
