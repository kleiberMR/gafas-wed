const CODES={
a:`// Gafas detectoras de obstáculos - Arduino
const int TRIG = 9;
const int ECHO = 10;
const int BUZZER = 8;

void setup() {
  pinMode(TRIG, OUTPUT);
  pinMode(ECHO, INPUT);
  pinMode(BUZZER, OUTPUT);
}

long distanciaCm() {
  digitalWrite(TRIG, LOW);
  delayMicroseconds(2);
  digitalWrite(TRIG, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG, LOW);
  long t = pulseIn(ECHO, HIGH, 30000);  // espera máx. 30 ms
  return t / 58;                        // 0 = sin obstáculo
}

void loop() {
  long d = distanciaCm();
  if (d > 0 && d < 150) {               // obstáculo a menos de 1,5 m
    tone(BUZZER, 1000);
    delay(50);
    noTone(BUZZER);
    delay(map(d, 0, 150, 30, 500));     // más cerca = más rápido
  } else {
    noTone(BUZZER);
    delay(100);
  }
}`,
b:`# main.py - MicroPython (Arduino Nano ESP32 / Nano RP2040)
# Ajusta los números de pin según tu placa.
from machine import Pin, PWM, time_pulse_us
import time

trig = Pin(9, Pin.OUT)
echo = Pin(10, Pin.IN)
buzzer = PWM(Pin(8))

def distancia_cm():
    trig.value(0)
    time.sleep_us(2)
    trig.value(1)
    time.sleep_us(10)
    trig.value(0)
    t = time_pulse_us(echo, 1, 30000)
    return t / 58 if t > 0 else -1

while True:
    d = distancia_cm()
    if 0 < d < 150:                      # obstáculo a menos de 1,5 m
        buzzer.freq(1000)
        buzzer.duty_u16(30000)
        time.sleep_ms(50)
        buzzer.duty_u16(0)
        time.sleep_ms(int(30 + d * 3))   # más cerca = más rápido
    else:
        buzzer.duty_u16(0)
        time.sleep_ms(100)`};
const pre=document.getElementById('code');let cur='a';
function show(k){cur=k;pre.textContent=CODES[k];document.querySelectorAll('.tabs button').forEach(b=>b.classList.toggle('on',b.dataset.t===k))}
document.querySelectorAll('.tabs button').forEach(b=>b.onclick=()=>show(b.dataset.t));
show('a');
document.getElementById('copy').onclick=async function(){try{await navigator.clipboard.writeText(CODES[cur]);this.textContent='¡Copiado!'}catch(e){this.textContent='Selecciona y copia'}setTimeout(()=>this.textContent='Copiar código',1800)};
