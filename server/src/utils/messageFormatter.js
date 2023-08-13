import { toOrdinalConverter } from "./toOrdinalConverter.js";

export const messageFormatter = (id, gender, year) => {
  let formatted_gender, institute_type;

  if (gender === "MALE") formatted_gender = "Boy";
  else if (gender === "FEMALE") formatted_gender = "Girl";
  else formatted_gender = "Student";

  if (year.includes("GRADE")) {
    institute_type = "school";
  } else {
    institute_type = "college";
  }

  if (institute_type === "school") {
    return {
      id,
      gender,
      text: `${formatted_gender} in grade ${year
        .split("_")[1]
        .toLowerCase()}th`,
    };
  } else {
    let ordinal_year = toOrdinalConverter[year.split("_")[1]];
    return {
      id,
      gender,
      text: `${formatted_gender} in ${ordinal_year} year pursuing ${year.split("_")[0].toLowerCase()}s`,
    };
  }
};
