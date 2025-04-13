// Function to convert time (e.g., "10:00 AM") to minutes for easy comparison
const parseTimeToMinutes = (timeStr) => {
    if (!timeStr) return 0;
    const [time, modifier] = timeStr.split(' ');
    let [hours, minutes] = time.split(':').map(Number);

    if (modifier === 'PM' && hours !== 12) hours += 12;
    if (modifier === 'AM' && hours === 12) hours = 0;

    return hours * 60 + minutes;
  };
  
export const isStoreClosedToday = (store) => {
    if (!store.holidayHoursList) return false;

    const today = new Date();
    const todayDateString = today.toISOString().split('T')[0]; // Format: YYYY-MM-DD
    const currentTime = today.getHours() * 60 + today.getMinutes(); // Convert to minutes for comparison

    for (const holiday of store.holidayHoursList) {
      if (holiday.holidayDate === todayDateString) {
        if (holiday.isClosed) return true;

        // Parse opening and closing times
        const openingMinutes = parseTimeToMinutes(holiday.openingTime);
        const closingMinutes = parseTimeToMinutes(holiday.closingTime);

        // Deactivate store if current time is outside holiday hours
        if (currentTime < openingMinutes || currentTime > closingMinutes) {
          return true;
        }
      }
    }
    return false;
  };