export function formatDateTime(isoDate: any): string {
  if (!isoDate) return "";
  
  const dateObject = new Date(isoDate);
  
  // Check if date is valid
  if (isNaN(dateObject.getTime())) return "";
  
  // Get hours and minutes
  let hours = dateObject.getHours();
  const minutes = String(dateObject.getMinutes()).padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  const formattedTime = `${hours}:${minutes} ${ampm}`;
  
  // Get day
  const day = dateObject.getDate();
  
  // Get month name (short)
  const monthNames = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];
  const month = monthNames[dateObject.getMonth()];
  
  // Get year
  const year = dateObject.getFullYear();
  
  // Format: "12:30 PM, 11 Dec 2025"
  return `${formattedTime}, ${day} ${month} ${year}`;
}
