<div align="center">

# 🌸 Clic Clac 🌸

**Minijuegos cozy de un solo botón, en pixel art pastel.**
Trabajos rutinarios, pero bonitos: llenar botellas, grapar folios, tostar pan, hacer una tortilla, revelar fotos…
Todo se juega con **un solo botón** y cuenta la precisión hasta la nota **S+**.

### [▶ Jugar ahora en el navegador](https://adry2342.github.io/Clic-Clac/)

*Funciona en PC y en móvil. Sin instalar nada.*

<img src="media/menu.png" width="720" alt="Menú de Clic Clac con los cinco minijuegos">

</div>

---

## 🎮 Los minijuegos

Cada juego tiene **varias fases** y cada fase cambia el ritmo: unas piden un clic perfecto, otras mantener y soltar, otras aguantar el pulso.

<table>
<tr>
<td width="50%" valign="top">

### 🍼 Botellas en la cinta
<img src="media/botellas.gif" width="100%" alt="Botellas en la cinta">

**Fase 1 · Llenar.** El grifo se abre solo: cierra cuando el líquido llegue a la línea rosa. Cada forma (refresco, garrafa, matraz…) se llena a su ritmo.
**Fase 2 · Tapones.** Las botellas vuelven y el tapón tarda en caer: suéltalo un pelín antes.

</td>
<td width="50%" valign="top">

### 📎 Grapadora
<img src="media/grapadora.gif" width="100%" alt="Grapadora">

**Fase 1 · Grapar.** Llega un montón de folios cada vez y tienes un momento para mirarlo antes de que la mano lo empuje. Grapa **solo** si lleva la marca rosa: los dibujos, las fotos, los que no tienen marca y los que ya llevan clip se dejan pasar.
**Fase 2 · Apilar.** Los montones grapados cuelgan de una pinza que se balancea: suéltalos encima de la torre. Si quedan torcidos, la torre se inclina y se cae.

</td>
</tr>
<tr>
<td valign="top">

### 🍞 Tostadora
<img src="media/tostadora.gif" width="100%" alt="Tostadora">

**Fase 1 · Tostar.** Mantén para bajar la palanca y suelta en el color del pedido.
**Fase 2 · Untar.** La espátula cruza una sola vez: mantén al entrar en la tostada y suelta al salir. Mantequilla, mermelada, crema de cacahuete, miel…

</td>
<td valign="top">

### 🥔 Tortilla de patatas
<img src="media/tortilla.gif" width="100%" alt="Tortilla de patatas">

Corta rodajas iguales, casca los huevos con la fuerza justa, bate a ritmo sin salirte de la zona y dale la vuelta con el impulso exacto.

</td>
</tr>
<tr>
<td colspan="2" valign="top" align="center">

### 📷 Fotos a coches
<img src="media/fotos.gif" width="60%" alt="Fotos a coches">

**Fase 1 · Calle.** Cámara de carrete: haz la foto cuando el coche pase por el centro. El carrete es limitado, hay patitos, gatos y perros cruzando… y algún pájaro que se posa en el objetivo.
**Fase 2 · Cuarto oscuro.** Mece la cubeta y suelta cuando tu foto tenga el tono de la muestra.
**Fase 3 · Tendedero.** Cuelga cada foto cuando pase justo bajo la pinza.

</td>
</tr>
</table>

---

## ⭐ Cómo se puntúa

| Nota | Cuándo |
|:---:|---|
| ★ **Perfecto** | Justo en el momento (unos 50 ms de margen) |
| **Bien** | Muy cerca |
| **Regular** | Cerca |
| ✕ **Fallo** | Lejos, o pulsar cuando no hay nada que hacer |

La nota **S+** solo se consigue con todo en *Perfecto*. Al fallar, el juego te dice si **te adelantaste** o **te pasaste**.

## 🕹️ Controles

Toca la pantalla, haz clic o pulsa cualquier tecla. Nada más. También funciona con mando.

---

## 🛠️ Para desarrolladores

El juego es un único `index.html`, sin dependencias ni instalación.

- `src/shell.html`: HTML y CSS de la interfaz.
- `src/game.js`: todo el juego (dibujo pixel a pixel en canvas, sonido y lógica).
- `./build.sh`: junta los dos en `index.html`.

Para probar en local, abre `index.html` en el navegador.

## Créditos

Idea, dirección y pruebas: **Adri** ([@adry2342](https://github.com/adry2342)).
