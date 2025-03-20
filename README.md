# ComparadorVideojuegos

---¿Qué hace la aplicación?---
Esta aplicación es un comparador de precios de videojuegos que permite a los usuarios buscar títulos en varias tiendas en línea y obtener información sobre sus precios. 
Usa Electron para la interfaz de usuario y Puppeteer para realizar web scraping en tiendas como Steam, Epic Games y Humble Bundle.

1.El usuario ingresa el nombre de un videojuego en un formulario.
2.La aplicación usa Puppeteer para buscar los precios en Steam, Epic Games y Humble Bundle.
3.Los resultados se agrupan por tienda y se muestran en la interfaz, incluyendo:
  -Nombre del videojuego.
  -Precio original (si está disponible).
  -Precio con descuento.
  -Enlace para comprarlo directamente.
  
---¿Cómo ejecutar la aplicación?---
1. Tener instalado Node.js (versión 16 o superior) y GIT.
2. Abrir la terminal.
3. Navegar al directorio donde tengas el proyecto descargado, por ejemplo: cd ~/MisProyectos
4. Clonar el Repositorio: Ejecuta el siguiente comando para clonar el repositorio: git clone https://github.com/Rusby6/ComparadorVideojuegos.git
   Esto creará una carpeta llamada ComparadorVideojuegos en tu directorio actual.
5. Dentro de la ruta del proyecto en la terminal lo iniciamos con este comando:
npm start
6. Ingresar al Directorio del Proyecto:
cd ComparadorVideojuegos
Ejecuta el siguiente comando para instalar las dependencias necesarias:
npm install
Este comando lee el archivo package.json y descarga todos los módulos necesarios para la aplicación.



---AUTOEVALUACION---

De nota me gustaría tener un sobresaliente alto ya que me parece que la aplicación puede resultarle muy util a muchas personas que tengan aficion por los videojuegos.
Ademas, cumple con todos los requisitos propuestos, utiliza la interfaz gráfica de electrón, 
se usa la herramienta de puppeteer para hacer web scraping y muestra los datos deseados por el usuario.
