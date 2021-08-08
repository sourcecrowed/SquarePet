
export default class NameGenerator
{
  public static generateRomajiName(minChars: number, maxChars: number)
  {
    let name: string = "";
    //let minChars: number = 3;
    //let maxChars: number = minChars + Math.random() * 10;

    let combos = [
      "A",   "I",   "E",   "U",  "O",   "KA",  "KI",  "KU",  "KE",  "KO",
      "SA",  "SHI", "SU",  "SE", "SO",  "TA",  "CHI", "TSU", "TE",  "TO",
      "CHA", "CHU", "CHO", "NA", "NI",  "NU",  "NE",  "NO",  "NYA", "NYU",
      "NYO", "HA",  "HI",  "HU", "HE",  "HO",  "HYA", "HYU", "HYO", "MA",
      "MI",  "MU",  "ME",  "MO", "MYA", "MYU", "MYO", "YA",  "YU",  "YO",
      "RA",  "RI",  "RU",  "RE", "RO",  "RYA", "RYU", "RYO", "WA",  "WI",
      "WE",  "WO",  "GA",  "GI", "GU",  "GE",  "GO",  "ZA",  "JI",  "ZU",
      "ZE",  "ZO",  "DA",  "JI", "DU",  "DE",  "DO",  "BA",  "BI",  "BU",
      "BE",  "BO",  "PA",  "PI", "PU",  "PE",  "PO",  "N"
    ];

    while (name.length < maxChars) {
      let combo = combos[Math.floor(Math.random() * (combos.length - 1))];

      if (name.length == 0 && combo == "N")
        continue;

      name += combo;
    }

    name = name[0] + name.substring(1, name.length).toLowerCase();

    return name;
  }
}
