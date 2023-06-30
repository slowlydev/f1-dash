type StatusMessage = {
  message: string;
  color: string;
};

type MessageMap = {
  [key: string]: StatusMessage;
};

export const getTrackStatusMessage = (
  statusCode: number | undefined
): StatusMessage | null => {
  const messageMap: MessageMap = {
    1: { message: "Track Clear", color: "bg-emerald-500" },
    2: { message: "Yellow Flag", color: "bg-yellow-500" },
    3: { message: "Flag", color: "bg-yellow-500" },
    4: { message: "Safety Car", color: "bg-yellow-500" },
    5: { message: "Red Flag", color: "bg-red-500" },
    6: { message: "VSC Deployed", color: "bg-yellow-500" },
    7: { message: "VSC Ending", color: "bg-yellow-500" },
  };

  return statusCode ? messageMap[statusCode] ?? messageMap[0] : null;
};
