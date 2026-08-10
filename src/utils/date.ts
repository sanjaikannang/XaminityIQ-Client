// App-wide date display format: DD/MM/YYYY (e.g. 01/01/2001).
export const formatDate = (value: string | number | Date): string => {
    const date = new Date(value);
    if (isNaN(date.getTime())) return "-";
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
};

// DD/MM/YYYY, hh:mm AM/PM
export const formatDateTime = (value: string | number | Date): string => {
    const date = new Date(value);
    if (isNaN(date.getTime())) return "-";
    const time = date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
    return `${formatDate(date)}, ${time}`;
};
