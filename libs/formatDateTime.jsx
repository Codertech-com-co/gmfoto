
export default (datetime) => {
    const date = new Date(dateTimeString);
    if (date.includes('1899')) {
        return "-";
    } else {
        const pad = (num) => num.toString().padStart(2, '0');
    
        const year = date.getFullYear();
        const month = pad(date.getMonth() + 1);
        const day = pad(date.getDate());
    
        let hours = date.getHours();
        const minutes = pad(date.getMinutes());
        const seconds = pad(date.getSeconds());
    
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        hours = pad(hours);
    
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds} ${ampm}`;
    }


}