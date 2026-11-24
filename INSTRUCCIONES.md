# Invitación de boda — versión 2.0

El proyecto conserva el diseño original y agrega los 7 ajustes solicitados.

## Archivos

- `index.html`: estructura y textos visibles.
- `styles.css`: paleta Gama 4, diseños, fondo floral y versión móvil.
- `script.js`: nombres, fecha, carruseles, enlaces, calendario y RSVP.
- `images/fondo-floral.png`: **imagen original aportada** para «El gran día».
- `logos/liverpool.svg` y `logos/amazon.svg`: identificadores vectoriales estilizados de las tiendas, preparados con buen contraste.
- `google-sheets/Code.gs`: código del formulario para guardar respuestas en Sheets.

## 1. Abrir la página

Abre esta carpeta en Visual Studio Code, instala **Live Server** y abre `index.html` con ese servidor. También puedes abrir directamente `index.html` en el navegador para inspeccionar el diseño. No se necesita compilar.

## 2. Configurar los datos reales

En la parte superior de `script.js`, modifica el objeto `wedding`:

- `nombre1`, `nombre2`: nombres mostrados en la portada y el pie.
- `fecha`: fecha para la **cuenta regresiva**, actualmente el **29/01/2027 a las 18:00** (inicio de recepción).
- `recordatorio`: fecha del botón **Agregar recordatorio**, actualmente el **29/01/2027 a las 14:00**, hora Ciudad de México.
- `recepcion.nombre`, `recepcion.direccion`: lugar y dirección. Se activará el enlace a Maps automáticamente cuando se complete la dirección. Se puede agregar `recepcion.mapa` con el enlace específico.
- `mesasDeRegalos.liverpool` y `.amazon`: cambia los enlaces generales por **los enlaces específicos de los novios** cuando se tengan.
- `coloresReservados`: escribe la lista de tonos que no deben usar los invitados. Actualmente aparece «Por confirmar», para no asumir colores prohibidos.
- `googleSheetsWebApp`: pega la URL del Web App de Google Apps Script para activar el envío.

Ejemplo de colores reservados (solo un ejemplo técnico, NO está activado):

```js
coloresReservados: [
  { nombre: "Color reservado 1", color: "#FFFFFF" },
  { nombre: "Color reservado 2", color: "#EEEEEE" }
],
```

## 3. Colocar fotos

Guarda imágenes JPG en `images/` con los siguientes nombres (sin cambiar rutas del código):

**Portada e historia:** `portada.jpg`, `historia.jpg`.

**Galería (6):** `galeria-1.jpg` a `galeria-6.jpg`.

**Carrusel de mujeres (6):** `vestimenta-mujer-1.jpg` a `vestimenta-mujer-6.jpg`.

**Carrusel de hombres (6):** `vestimenta-hombre-1.jpg` a `vestimenta-hombre-6.jpg`.

**Carrusel del lugar (6):** `lugar-1.jpg` a `lugar-6.jpg`.

Si falta una fotografía, el diseño muestra un marcador decorativo con el nombre que corresponde. Los carruseles cambian automáticamente cada ~4.5 s, permiten avanzar y retroceder, y respetan la preferencia de movimiento reducido. Se detienen mientras interactúas con ellos.

## 4. Crear Google Sheets y conectar el RSVP

**Debes completar esta configuración antes de compartir la invitación con invitados.** El formulario no puede guardar respuestas en una cuenta que todavía no fue conectada.

1. Crea una hoja de cálculo nueva en Google Sheets, por ejemplo `Confirmaciones de boda`.
2. Desde esa misma hoja, abre **Extensiones > Apps Script**.
3. Borra el código de ejemplo y pega todo el archivo `google-sheets/Code.gs`.
4. Guarda el proyecto.
5. En Apps Script, selecciona **Implementar > Nueva implementación**.
6. Selecciona el tipo **Aplicación web**.
7. Elige **Ejecutar como: Yo** y **Quién tiene acceso: Cualquier persona** (permite que invitados sin cuenta envíen su respuesta).
8. Autoriza los permisos que Google solicite para administrar esa hoja.
9. Copia la URL final que termina en `/exec` y pégala entre comillas en `script.js`, en `googleSheetsWebApp`.
10. Publica la página e **intenta una confirmación de prueba**. Abre la hoja `Confirmaciones` para comprobar que aparece una fila.

La hoja tendrá las columnas:

| Fecha de registro | Nombre completo | Asistencia | Mensaje | ID de envío |
|---|---|---|---|---|

El formulario **no pregunta por número de asistentes** y **no utiliza WhatsApp**. Envía el registro mediante Apps Script. Después consulta por un ID aleatorio si aparece en la hoja, sin exponer los nombres a terceros. La confirmación visible de éxito se muestra únicamente si la comprobación responde que el ID ya está guardado.

### Si cambias `Code.gs` después de la primera implementación

En Apps Script entra a **Implementar > Administrar implementaciones > Editar > Nueva versión**, vuelve a implementar, y comprueba que el URL utilizado por la página sigue siendo el de `/exec`.

### Privacidad y limitaciones

- La hoja de cálculo debe permanecer **privada** y con acceso solamente para los organizadores.
- La aplicación web será pública para recibir registros. Es una solución sencilla para invitaciones privadas, no un sistema avanzado contra spam.
- Las confirmaciones de prueba también se guardan en la hoja; bórralas si no quieres contarlas.
- El navegador puede bloquear temporalmente la respuesta de verificación si hay extensiones o políticas de red; si no muestra confirmación, **revisa la hoja antes de volver a enviar**.
- No compartas públicamente el enlace editable de Google Sheets ni credenciales.

## 5. ¿Dónde cambiar los textos?

Los títulos y textos de portada, historia, vestimenta, regalos y RSVP están en `index.html`. El CSS mantiene la misma paleta de la primera versión.

## 6. Resumen de ajustes implementados

1. Itinerario sin ceremonia: 18:00 recepción, 19:00 cena, 21:00 baile.
2. Vestimenta formal: carruseles automáticos de 6 imágenes para mujeres y 6 para hombres y apartado de colores reservados.
3. Un solo lugar de recepción con carrusel de fotografías y enlace a Google Maps.
4. Recordatorio descargable para 29/01/2027 a las 14:00; la recepción sigue empezando a las 18:00.
5. Galería de 6 fotografías.
6. Mesa de regalos Liverpool y Amazon justo después de la galería.
7. RSVP sin número de asistentes ni WhatsApp, con registro en Google Sheets.
8. Fondo floral original en la sección «El gran día».

