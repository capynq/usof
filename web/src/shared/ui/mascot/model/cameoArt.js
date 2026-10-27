import clipFooter from "../../../assets/mascots/clip-footer.svg";
import clipForm from "../../../assets/mascots/clip-form.svg";
import scoutFooter from "../../../assets/mascots/scout-footer.svg";
import scoutEmpty from "../../../assets/mascots/scout-empty.svg";
import wispFooter from "../../../assets/mascots/wisp-footer.svg";
import wispForm from "../../../assets/mascots/wisp-form.svg";
import wispAuth from "../../../assets/mascots/wisp-auth.svg";
import byteFooter from "../../../assets/mascots/byte-footer.svg";
import byteForm from "../../../assets/mascots/byte-form.svg";
import byteLoading from "../../../assets/mascots/byte-loading.svg";
import byteError from "../../../assets/mascots/byte-error.svg";

export const CAMEO_ART = {
  clip: {
    footer: { src: clipFooter, width: 64, height: 48 },
    form: { src: clipForm, width: 96, height: 80 },
  },
  scout: {
    footer: { src: scoutFooter, width: 64, height: 48 },
    empty: { src: scoutEmpty, width: 96, height: 80 },
  },
  wisp: {
    footer: { src: wispFooter, width: 64, height: 48 },
    form: { src: wispForm, width: 96, height: 80 },
    auth: { src: wispAuth, width: 96, height: 80 },
  },
  byte: {
    footer: { src: byteFooter, width: 64, height: 48 },
    form: { src: byteForm, width: 96, height: 80 },
    loading: { src: byteLoading, width: 96, height: 80 },
    error: { src: byteError, width: 96, height: 80 },
  },
};
