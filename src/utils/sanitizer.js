/** sanitizing function that is used to delete spaces from the incomming requests */
const spacesSanitizer = ({ query = '' }) => {
    var str = query;
    str = str.replace(/\s\s+/g, ' ').trim();
    return str;
};
/** It serves as a sanitizer that removes the effects of glob pattern wildecards by adding a " / " before each one that according to the glob pattern desactivates the effect the wildecard */
const globSanitizer = ({ query = '' }) => {
    var str = query;
    // Searching for wildecards in our query and adding "/" before them
    str = str.replace(/([*?\\!~])/g, '/$1');
    return str;
};

module.exports = {
    spacesSanitizer,
    globSanitizer,
};
