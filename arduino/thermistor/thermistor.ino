#include <Thermistor.h> 
Thermistor temp(2); //VARIÁVEL DO TIPO THERMISTOR, INDICANDO O PINO ANALÓGICO (A2) EM QUE O TERMISTOR ESTÁ CONECTADO
void setup() {
  Serial.begin(9600); 
  delay(1000);
}
void loop() {
  int temperature = temp.getTemp(); /
  Serial.print("Temperatura: "); 
  Serial.print(temperature); 
  Serial.println("*C"); 
  delay(1000);
}