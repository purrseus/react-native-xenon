export const limitChar = (value: any, limit = 5000) => {
  const stringValue = typeof value === 'string' ? value : JSON.stringify(value);

  return stringValue.length > limit
    ? `${stringValue.slice(0, limit)}\n---LIMITED TO ${limit} CHARACTERS---`
    : stringValue;
};

export const createHttpHeaderLine = (key: string, value: string): string => `${key}: ${value}\n`;

export const getHttpInterceptorId = () => {
  const timestamp = Date.now().toString(36);
  const randomNum = Math.random().toString(36).substring(2, 10);
  return timestamp + randomNum;
};

export const createSocketDataLine = (prefix: 'Sent' | 'Received', data: any) =>
  `${prefix}: ${limitChar(data)}\n`;

export const formatMethod = (method?: string) => method ?? 'GET';

export const formatStatusCode = (statusCode?: number) => `${statusCode ?? 'pending'}`;

export const formatLog = (type: string, values: any[]) => {
  return `${type.toUpperCase()}: ${values.map((value, index, array) => {
    const isLastItem = index === array.length - 1;

    return limitChar(value) + (isLastItem ? '' : ' ');
  })}}`;
};
