export const formatDate = (d: Date) => {
  const pad0 = (n: number) => ("00" + n).slice(-2);
  const days = ["日", "月", "火", "水", "木", "金", "土"];

  const year = d.getFullYear();
  const month = pad0(d.getMonth() + 1);
  const date = pad0(d.getDate());
  const day = days[d.getDay()];

  const text = `${year}-${month}-${date} (${day})`;

  return text;
};

export const formatDateTime = (d: Date) => {
  const pad0 = (n: number) => ("00" + n).slice(-2);
  const days = ["日", "月", "火", "水", "木", "金", "土"];

  const year = d.getFullYear();
  const month = pad0(d.getMonth() + 1);
  const date = pad0(d.getDate());
  const day = days[d.getDay()];
  const hour = pad0(d.getHours());
  const min = pad0(d.getMinutes());

  const text = `${year}-${month}-${date} (${day}) ${hour}:${min}`;

  return text;
};
