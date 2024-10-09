// Arrow function to format date
export const formatDate = (dateTimeString) => {
    // Convert the string to a JavaScript Date object
    let dateObject = new Date(dateTimeString);

    // Get the day, month, and year
    let day = dateObject.getDate().toString().padStart(2, '0'); // Ensures 2 digits for day
    let month = dateObject.toLocaleString('default', { month: 'long' });
    let year = dateObject.getFullYear();

    // Return formatted date as "Month DD, Year"
    return `${month} ${day}, ${year}`;
};
