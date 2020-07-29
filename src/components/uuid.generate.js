const UIDGenerator = (function() {
    const letters = "abcdefghijklmnopqrstuvwxyz" + "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const ALLOWED_CHARS = "0123456789" + letters;
    const NUMBER_OF_CODEPOINTS = ALLOWED_CHARS.length;
    const CODESIZE = 11;
    const CODE_PATTERN = '^[a-zA-Z]{1}[a-zA-Z0-9]{10}$';

    const generateCode = size => {
        let randomChars = '';

        // First char must be a letter
        randomChars = letters.charAt(Math.floor(Math.random() * letters.length));

        for (var i = 1; i < size; ++i) {
            randomChars += ALLOWED_CHARS.charAt(Math.floor(Math.random() 
            * NUMBER_OF_CODEPOINTS));
        }

        return randomChars;
    }

    return {
        UUID: () => generateCode(CODESIZE),
        isValidUid: code => code != null && CODE_PATTERN.match().length > 0
    }
})();

module.exports = UIDGenerator;
