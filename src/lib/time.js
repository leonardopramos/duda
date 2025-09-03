import { useEffect, useMemo, useState } from "react";

function diffParts(from, to) {
  if (to < from) [from, to] = [to, from];

  const start = new Date(from);
  const end = new Date(to);

  let months =
    (end.getFullYear() - start.getFullYear()) * 12 +
    (end.getMonth() - start.getMonth());
  const monthAdjusted = new Date(
    start.getFullYear(),
    start.getMonth() + months,
    start.getDate(),
    start.getHours(),
    start.getMinutes(),
    start.getSeconds()
  );
  if (monthAdjusted > end) months -= 1;

  const afterMonths = new Date(start);
  afterMonths.setMonth(afterMonths.getMonth() + months);

  const msPerDay = 24 * 60 * 60 * 1000;
  const days = Math.floor((end - afterMonths) / msPerDay);
  const afterDays = new Date(afterMonths.getTime() + days * msPerDay);

  let remaining = Math.floor((end - afterDays) / 1000);
  const hours = Math.floor(remaining / 3600);
  remaining -= hours * 3600;
  const minutes = Math.floor(remaining / 60);
  remaining -= minutes * 60;
  const seconds = remaining;

  return { months, days, hours, minutes, seconds };
}

export function useTicker(startDate) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return useMemo(() => diffParts(new Date(startDate), now), [startDate, now]);
}
