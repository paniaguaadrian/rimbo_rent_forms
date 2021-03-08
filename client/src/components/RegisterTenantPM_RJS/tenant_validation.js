export const newTenant = (values) => {
  let errors = {};

  if (!values.rentStartDate) {
    errors.rentStartDate = "You must specify a start date for the rental";
  }

  if (!values.PMAnex) {
    errors.PMAnex = "You must upload your Rental Agreement - Rimbo Annex";
  }

  return errors;
};
