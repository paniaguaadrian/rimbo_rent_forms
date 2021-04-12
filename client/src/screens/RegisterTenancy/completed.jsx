// React Components
import React from "react";
import PropTypes from "prop-types";

// Custom Components
import Success from "../../components/Success/Success";

// Multi language
import { withNamespaces } from "react-i18next";

const Completed = ({ t }) => {
  return (
    <>
      <Success
        title={t("RJ1.success.title")}
        subtitle={t("RJ1.success.subtitle")}
      />
    </>
  );
};

Completed.propTypes = {
  tenancy: PropTypes.object,
};

export default withNamespaces()(Completed);
