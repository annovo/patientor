import { State } from "./state";
import { Patient, Diagnosis } from "../types";
import _ from "lodash";

export type Action =
  | {
      type: "SET_PATIENT_LIST";
      payload: Patient[];
    }
  | {
      type: "SET_DIAGNOSIS_ARRAY";
      payload: Diagnosis[];
    }
  | {
      type: "ADD_PATIENT";
      payload: Patient;
    }
  | {
      type: "UPDATE_PATIENT_INFO";
      payload: Patient;
    };

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_PATIENT_LIST":
      return {
        ...state,
        patients: {
          ...action.payload.reduce(
            (memo, patient) => ({ ...memo, [patient.id]: patient }),
            {}
          ),
          ...state.patients,
        },
      };
    case "SET_DIAGNOSIS_ARRAY":
      return {
        ...state,
        diagnosis: action.payload,
      };
    case "ADD_PATIENT":
      return {
        ...state,
        patients: {
          ...state.patients,
          [action.payload.id]: action.payload,
        },
      };
    case "UPDATE_PATIENT_INFO":
      const newPatients = _.mapValues(state.patients, (p) =>
        p.id === action.payload.id ? action.payload : p
      );
      return {
        ...state,
        patients: {
          ...newPatients,
        },
      };
    default:
      return state;
  }
};

export const initilizePatients = (patients: Patient[]): Action => ({
  type: "SET_PATIENT_LIST",
  payload: patients,
});

export const initilizeDiagnosis = (diagnosis: Diagnosis[]): Action => ({
  type: "SET_DIAGNOSIS_ARRAY",
  payload: diagnosis,
});

export const addPatient = (patient: Patient): Action => ({
  type: "ADD_PATIENT",
  payload: patient,
});

export const updatePatientInfo = (patient: Patient): Action => ({
  type: "UPDATE_PATIENT_INFO",
  payload: patient,
});
