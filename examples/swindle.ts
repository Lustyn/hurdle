import { AChar, HurdleBitmap, IHurdle, unique } from "../src/hurdle";
import { hurdle, WORDS_PATH, logTruncatedList } from "./utils";
import * as readline from "readline";

const DICTIONARY_LETTER_FREQUENCIES = {
    a: 7.8,
    b: 2,
    c: 4,
    d: 3.8,
    e: 11,
    f: 1.4,
    g: 3,
    h: 2.3,
    i: 8.2,
    j: 0.21,
    k: 2.5,
    l: 5.3,
    m: 2.7,
    n: 7.2,
    o: 6.1,
    p: 2.8,
    q: 0.24,
    r: 7.3,
    s: 8.7,
    t: 6.7,
    u: 3.3,
    v: 1,
    w: 0.91,
    x: 0.27,
    y: 1.6,
    z: 0.44
}

const scoreWord = (word: string) => {
    const chars = unique(word);

    return Array.from(chars.values())
        .map(char => DICTIONARY_LETTER_FREQUENCIES[char])
        .reduce((a, b) => a + b, 0);
}

// Command line application that allows you to filter a hurdle word list
// Mostly useful for calculating theoretically optimal solutions or cheating
class Swindle {
    hurdle!: IHurdle;
    rl!: readline.ReadLine;

    async init() {
        await this.reload();

        return this;
    }

    async reload() {
        this.hurdle = await hurdle(WORDS_PATH);
    }

    private printCount(countBefore: number, countAfter: number) {
        console.log(`${countBefore - countAfter} words removed, ${countAfter} words remaining`);
    }

    async query(includes: Set<AChar>, excludes: Set<AChar>) {
        const countBefore = this.hurdle.toArray().length;

        this.hurdle = this.hurdle
            .includes(includes)
            .excludes(excludes);

        const countAfter = this.hurdle.toArray().length;

        this.printCount(countBefore, countAfter);
    }

    async include(includes: Set<AChar>) {
        this.query(includes, new Set<AChar>());
    }

    async exclude(excludes: Set<AChar>) {
        this.query(new Set<AChar>(), excludes);
    }

    async positional(mask: string) {
        const words = this.hurdle.toArray();
        const countBefore = words.length;
        const chars = mask.split("");
        let leftAligned = true;

        if (chars[0] === ">" || chars[0] === "<")
            leftAligned = chars.shift() === "<";

        // For each word, check that the characters in the mask match
        const result: string[] = [];

        for (const word of words) {
            let match = true;

            const offset = leftAligned ? 0 : word.length - chars.length;

            for (let i = 0; i < chars.length && match; i++) {
                const char = word[i + offset];
                const maskChar = chars[i];

                // If the mask character is a wildcard, then we don't care what the word character is
                if (maskChar === "*" || maskChar === "_" || maskChar === "?")
                    continue;

                match = char === maskChar;
                
                if (!match) break;
            }

            if (match)
                result.push(word);
        }

        this.hurdle = new HurdleBitmap();
        this.hurdle.insertMany(result);
        const countAfter = this.hurdle.toArray().length;
        
        this.printCount(countBefore, countAfter);
    }

    async top(n: number = 10) {
        // Get the top 100 words with the highest frequency
        const words = this.hurdle.toArray();
        const result = [];
        
        // For each word, get the unique characters and sum their frequencies
        for (const word of words) {
            const score = scoreWord(word);

            result.push({ word, score });
        }

        // Sort the results by score
        result.sort((a, b) => b.score - a.score);

        logTruncatedList(result.map(i => i.word), n);
    }

    async score(word: string) {
        console.log(`${word} has a score of ${scoreWord(word)}`);
    }

    async random() {
        const words = this.hurdle.toArray();
        const randomIndex = Math.floor(Math.random() * words.length);

        console.log(words[randomIndex]);
    }

    question() {
        this.rl.question("> ", async (query: string) => {
            let running = true;
            const [command, ...args] = query.split(" ");

            switch (command) {
                case "reload":
                    await this.reload();
                    break;
                case "i":
                case "include":
                    await this.include(new Set<AChar>(args as AChar[]));
                    break;
                case "e":
                case "exclude":
                    await this.exclude(new Set<AChar>(args as AChar[]));
                    break;
                case "p":
                case "positional":
                    await this.positional(args.join(""));
                    break;
                case "t":
                case "top":
                    await this.top(parseInt(args[0]) || 10);
                    break;
                case "s":
                case "score":
                    await this.score(args[0]);
                    break;
                case "r":
                case "random":
                    await this.random();
                    break;
                case "q":
                case "quit":
                    running = false;
                    break;
                default:
                    console.log("Unknown command");
                    break;
            }

            if (running)
                this.question();
            else
                this.rl.close();
        });
    }

    main() {
        // Read user input
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        this.question();
    }
}

new Swindle()
    .init()
    .then(swindle => swindle.main())
    .catch(console.error);