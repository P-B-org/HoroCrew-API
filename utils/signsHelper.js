const Sign = require("../models/Sign.model");

const zodiacSigns = [
  "Capricorn",
  "Aquarius",
  "Pisces",
  "Aries",
  "Taurus",
  "Gemini",
  "Cancer",
  "Leo",
  "Virgo",
  "Libra",
  "Scorpio",
  "Sagittarius",
];

//SUN SIGN CALC
function calculateSunSign(day, month) {
  // Define an array of zodiac sign dates
  const zodiacSignDates = [
    { month: 12, day: 20 },
    { month: 1, day: 19 },
    { month: 2, day: 20 },
    { month: 3, day: 20 },
    { month: 4, day: 21 },
    { month: 5, day: 21 },
    { month: 6, day: 22 },
    { month: 7, day: 23 },
    { month: 8, day: 23 },
    { month: 9, day: 23 },
    { month: 10, day: 22 },
    { month: 11, day: 22 },
  ];

  // Find the zodiac sign based on the birth date
  let sunSign = "";
  for (let i = 0; i < zodiacSignDates.length; i++) {
    const zsd = zodiacSignDates[i];
    if (
      (month === zsd.month && day >= zsd.day) ||
      (month === (zsd.month + 1) % 12 && day < zsd.day)
    ) {
      sunSign = zodiacSigns[i];
      break;
    }
  }

  console.log('desde la funcion', sunSign, day, month)

  return sunSign;
}

//MOON SIGN CALC
function calculateMoonSign(day, month, year) {
  // Calculate the Julian date of the birth date
  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;
  const jd =
    day +
    Math.floor((153 * m + 2) / 5) +
    365 * y +
    Math.floor(y / 4) -
    Math.floor(y / 100) +
    Math.floor(y / 400) -
    32045;

  // Calculate the number of days since January 1, 2000 (J2000.0)
  const daysSinceJ2000 = jd - 2451545.0;

  // Calculate the moon's position
  const moonLongitude = (218.32 + 13.176396 * daysSinceJ2000) % 360;
  const moonAnomaly = (134.9634 + 13.064993 * daysSinceJ2000) % 360;
  let moonEclipticLongitude =
    (moonLongitude + 6.2886 * Math.sin((moonAnomaly * Math.PI) / 180)) % 360;
  if (moonEclipticLongitude < 0) {
    moonEclipticLongitude += 360;
  }

  // Calculate the moon sign
  const moonSign = Math.floor(moonEclipticLongitude / 30 + 1);

  // find the index of the zodiac sign in the array
  const signIndex = Math.floor((moonSign - 1) / 2);

  // get the corresponding zodiac sign from the array
  const sign = zodiacSigns[signIndex];

  return sign;
}

//ASCENDANT SIGN CALC
function calculateAscendantSign(day, month, year, hour) {
  const birthDate = new Date(year, month - 1, day, hour);
  const birthTime = birthDate.getTime();
  const secondsInDay = 86400;
  const gmstAtMidnight =
    18.697374558 +
    24.06570982441908 * (Math.floor(birthTime / 1000 / secondsInDay) - 51544.5);
  const gmst =
    gmstAtMidnight +
    (1.00273790935 * ((birthTime / 1000) % secondsInDay) * 360) / 24 / 60 / 60;
  const longitude = -3.42468;
  const obliquityOfEcliptic = 23.4393;
  const sinAscendant = Math.sin(
    (Math.PI / 180) * (360 - ((gmst + longitude) % 360))
  );
  const cosAscendant =
    Math.cos((Math.PI / 180) * obliquityOfEcliptic) *
    Math.tan((Math.PI / 180) * sinAscendant);
  const ascendant = ((Math.atan(cosAscendant) * 180) / Math.PI + 180) / 30;

  const signIndex = Math.floor(ascendant);
  const sign = zodiacSigns[signIndex];

  return sign;
}

const astralCalc = async (
  timeOfBirth,
  dayOfBirth,
  monthOfBirth,
  yearOfBirth
) => {
  const hour = Number(timeOfBirth.slice(0, 2));

  const sunSign = calculateSunSign(Number(dayOfBirth), Number(monthOfBirth));
  const moonSign = calculateMoonSign(
    Number(dayOfBirth),
    Number(monthOfBirth),
    Number(yearOfBirth)
  );
  const ascendantSign = calculateAscendantSign(
    Number(dayOfBirth),
    Number(monthOfBirth),
    Number(yearOfBirth),
    hour
  );

  console.log('sunsign de arriba', sunSign)

  const findSignPromises = [sunSign, moonSign, ascendantSign].map((sign) =>
    Sign.findOne({ name: sign })
  );
  console.log(findSignPromises)

  const result = await Promise.all(findSignPromises)
    .then((signs) => {
      const [sunSign, moonSign, ascendantSign] = signs;
      return {
        ids: {
          sunSign: sunSign._id,
          moonSign: moonSign._id,
          ascendantSign: ascendantSign._id,
        },
        names: {
          sunSign: sunSign.name,
          moonSign: moonSign.name,
          ascendantSign: ascendantSign.name,
        },
      };
    })
    .catch((err) => err);
  console.log(result)
  return result;
};

module.exports = {
  astralCalc,
};
