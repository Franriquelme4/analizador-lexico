
import { promises as fs } from 'fs';

export const cleanText = async (texto) => {
    const file = await fs.readFile(process.cwd() + '/data/compoundWords.json', 'utf8');
    const palabrasCompuestas = JSON.parse(file);

    let textoModificado = texto;
    let cleanedText = textoModificado
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()¿?¡0-9]/g, "") // Eliminar caracteres especiales y números
        .toLowerCase();


    // Reemplazar palabras compuestas por cadenas temporales únicas
    palabrasCompuestas.forEach(compuesta => {
        if (cleanedText.includes(compuesta)) {
            let regex = new RegExp(compuesta.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
            cleanedText = cleanedText.replace(regex, compuesta.replace(" ", "_"));
        }
    });

    // console.log(cleanedText);
    // Realizar el procesamiento normal eliminando caracteres especiales y acentos, etc.


    // Dividir el texto limpio en palabras considerando espacios
    const words = cleanedText.split(/\s+/).filter(word => word.trim() !== '');

    return words;
};

export const processData = async (officeWords, clientWords) => {
    const file = await fs.readFile(process.cwd() + '/data/words.json', 'utf8');
    const lexicalAnalytics = JSON.parse(file);
    let officer = {
        positive: [],
        negative: [],
        greeting: [],
        farewell: [],
        id: []
    }
    let client = {
        negative: [],
        positive: []
    };
    let newWords = [];

    officeWords.forEach(word => {
        if (lexicalAnalytics.hasOwnProperty(word)) {
            let wordObject = lexicalAnalytics[word];
            switch (wordObject.type) {
                case "POSITIVO":
                    officer.positive.push(wordObject.word)
                    break;
                case "NEGATIVO":
                    officer.negative.push(wordObject.word)
                    break;
                case "SALUDO":
                    officer.greeting.push(wordObject.word)
                    break;
                case "DESPEDIDA":
                    officer.farewell.push(wordObject.word)
                    break;
                case "IDENTIFICACION":
                    officer.id.push(wordObject.word);
                default:
                    break;
            }
        } else {
            lexicalAnalytics[word] = {
                word: word,
                type: "NEUTRO",
                qualification: "NEUTRO",
                compound: "false",
            }
            newWords.push(word);
        }
    });

    clientWords.forEach(word => {
        if (lexicalAnalytics.hasOwnProperty(word)) {
            let wordObject = lexicalAnalytics[word];
            if (wordObject.type === "POSITIVO") {
                client.positive.push(wordObject.word);
            } else if (wordObject.type === "NEGATIVO") {
                client.negative.push(wordObject.word);
            }
        } else {
            lexicalAnalytics[word] = {
                word: word,
                type: "NEUTRO",
                qualification: "NEUTRO",
                compound: "false",
            }
            newWords.push(word);
        }
    });

    await fs.writeFile(process.cwd() + '/data/words.json', JSON.stringify(lexicalAnalytics, null, 2), 'utf8');
    return { officer, client, newWords }
}
