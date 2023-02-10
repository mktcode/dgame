import { ref } from "vue";

const isOpen = ref(true);

export function WelcomeModalState() {
  return {
    isOpen,
  };
}