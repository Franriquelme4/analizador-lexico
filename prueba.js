const cleanText = async (texto) => {
    const palabrasCompuestas = ["buenos dias", "buen dia", "buenas tardes", "buenas noches"]; // Definir las palabras que deben permanecer juntas

    let textoModificado = texto;
    let cleanedText = textoModificado
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()¿?¡0-9]/g, "") // Eliminar caracteres especiales y números
    .toLowerCase();

    // Reemplazar palabras compuestas por cadenas temporales únicas
    palabrasCompuestas.forEach(compuesta => {
        if(cleanedText.includes(compuesta)){
            let regex = new RegExp(compuesta.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
            cleanedText = cleanedText.replace(regex,compuesta.replace(" ","_"));
        }
    });
    return "words";
};

const texto = `Buen dia, buen dia buen dia gracias por llamar al servicio de atención al cliente de ABC`
const response = cleanText(texto)
// console.log(response)
