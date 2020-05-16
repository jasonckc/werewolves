import { action, thunk } from "easy-peasy";

const notifierModel = {
  /* Initial state */
  isOpen: false,
  variant: null,
  message: null,

  // Actions
  open: action((state, payload) => {
    state.isOpen = true;
  }),

  close: action((state, payload) => {
    state.isOpen = false;
  }),

  update: action((state, payload) => {
    state.isOpen = true;
    state.variant = payload.variant;
    state.message = payload.message;
  })
};

export default notifierModel;
