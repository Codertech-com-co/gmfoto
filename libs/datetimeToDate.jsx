
export default (datetime) => {
    const date = datetime.split('T')[0]
    if (date.includes('1899')) {
        return "-";
    } else {
        return datetime.split('T')[0]
    }


}