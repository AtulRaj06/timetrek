export const formatDateTime = (dateString) => {
  return new Date(dateString).toLocaleString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};

export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

export const formatTime = (dateString) => {
  return new Date(dateString).toLocaleString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

export const calculateDuration = (startTime, endTime) => {
  const start = new Date(startTime);
  const end = new Date(endTime);
  
  // Get the time difference in milliseconds
  const diffInMs = end - start;
  
  // Convert to hours and minutes
  const hours = Math.floor(diffInMs / (1000 * 60 * 60));
  const minutes = Math.floor((diffInMs % (1000 * 60 * 60)) / (1000 * 60));
  
  // Format the output
  let duration = '';
  if (hours > 0) {
      duration += `${hours} h`;
      if (minutes > 0) duration += ' ';
  }
  if (minutes > 0 || hours === 0) {
      duration += `${minutes} m`;
  }
  
  return duration;
}
