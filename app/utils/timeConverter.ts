// Receive timestampz string return HH:MM AM/PM

export const datetimeConverter = (datetimeString: string): string => {
  const datetime = new Date(datetimeString);
  const hours = datetime.getHours();
  const minutes = datetime.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  const newHours = hours % 12 || 12;
  const newMinutes = minutes < 10 ? "0" + minutes : minutes;
  const strTime = newHours + ":" + newMinutes + " " + ampm;
  return strTime;
};

export const millisecondsToHHMMSS = (milliseconds: number): string => {
  const seconds = milliseconds / 1000;
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds - hours * 3600) / 60);
  const newSeconds = Math.floor(seconds - hours * 3600 - minutes * 60);
  return (
    hours.toString().padStart(2, "0") +
    ":" +
    minutes.toString().padStart(2, "0") +
    ":" +
    newSeconds.toString().padStart(2, "0")
  );
};
