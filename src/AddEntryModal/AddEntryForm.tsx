import React from "react";
import { Grid, Button } from "semantic-ui-react";
import { Field, Formik, Form } from "formik";
import {
  TextField,
  EntriesOption,
  SelectField,
  NumberField,
  HospitalForm,
  OccupationalHealthcareForm,
  DiagnosisSelection
} from "./FormField";
import {
  Discharge,
  HealthCheckRating,
  Diagnosis,
  SickLeaveDates,
  EntriesType
} from "../types";
import { useStateValue } from "../state";

export type BaseEntryForm = {
  type: EntriesType;
  date: string;
  specialist: string;
  description: string;
  diagnosisCodes?: Array<Diagnosis["code"]>;
  healthCheckRating: HealthCheckRating;
  discharge: Discharge;
  employerName: string;
  sickLeave: SickLeaveDates;
};

interface Props {
  onSubmit: (values: BaseEntryForm) => void;
  onCancel: () => void;
}

const entriesOptions: EntriesOption[] = [
  { value: EntriesType.HealthCheck, label: "Health check" },
  { value: EntriesType.Hospital, label: "Hospital" },
  {
    value: EntriesType.OccupationalHealthcare,
    label: "Occupational Healthcare",
  },
];

export const AddEntryForm: React.FC<Props> = ({ onSubmit, onCancel }) => {
  const initValues = {
    date: "",
    specialist: "",
    description: "",
    diagnosisCodes: undefined,
    type: EntriesType.Hospital,
    healthCheckRating: 0,
    discharge: { date: "", criteria: "" },
    employerName: "",
    sickLeave: { startDate: "", endDate: "" },
  };

  const [{ diagnosis }] = useStateValue();

  const onTypeChange = (type: EntriesType) => {
    switch (type) {
      case EntriesType.HealthCheck:
        return (
          <Field
            label="Healthcheck Rating"
            name="healthCheckRating"
            min={HealthCheckRating.Healthy}
            max={HealthCheckRating.CriticalRisk}
            component={NumberField}
          />
        );
      case EntriesType.Hospital:
        return <HospitalForm />;
      case EntriesType.OccupationalHealthcare:
        return <OccupationalHealthcareForm />;
      default:
        return null;
    }
  };
  return (
    <Formik
      initialValues={initValues}
      onSubmit={onSubmit}
      validateOnChange={true}
      validate={(values) => {
        const requiredError = "Field is required";
        const errors: { [field: string]: string } = {};
        if (!values.date) {
          errors.date = requiredError;
        }
        if (!values.description) {
          errors.description = requiredError;
        }
        if (!values.specialist) {
          errors.specialist = requiredError;
        }
        if (
          values.type === EntriesType.Hospital &&
          (!values.discharge.date || !values.discharge.criteria)
        ) {
          errors.discharge = requiredError;
        }
        if (
          values.type === EntriesType.OccupationalHealthcare &&
          !values?.employerName
        ) {
          errors.employerName = requiredError;
        }
        return errors;
      }}
    >
      {({ isValid, dirty, values, setFieldTouched, setFieldValue }) => {
        return (
          <Form className="form ui">
            <Field
              label="Date"
              placeholder="YYYY-MM-DD"
              name="date"
              component={TextField}
            />
            <Field
              label="Specialist"
              placeholder="Specialist's name"
              name="specialist"
              component={TextField}
            />
            <Field
              label="Description"
              placeholder="Description"
              name="description"
              component={TextField}
            />
            <SelectField
              label="Entry type"
              name="type"
              options={entriesOptions}
            />
            {onTypeChange(values.type)}
            <DiagnosisSelection
              setFieldTouched={setFieldTouched}
              setFieldValue={setFieldValue}
              diagnoses={diagnosis}
            />
            <Grid>
              <Grid.Column floated="left" width={5}>
                <Button type="button" onClick={onCancel} color="red">
                  Cancel
                </Button>
              </Grid.Column>
              <Grid.Column floated="right" width={5}>
                <Button
                  type="submit"
                  floated="right"
                  color="green"
                  disabled={!dirty || !isValid}
                >
                  Add
                </Button>
              </Grid.Column>
            </Grid>
          </Form>
        );
      }}
    </Formik>
  );
};

export default AddEntryForm;
