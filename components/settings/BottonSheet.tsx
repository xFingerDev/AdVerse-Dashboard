import BottomSheet, {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { useCallback, useEffect, useRef } from "react";
import { StyleSheet, TouchableWithoutFeedback, View } from "react-native";

interface BottonSheetProps {
  isVisible: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const BottonSheet: React.FC<BottonSheetProps> = ({
  isVisible,
  onClose,
  children,
}) => {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  useEffect(() => {
    if (isVisible) {
      handlePresentModalPress();
    } else {
      bottomSheetModalRef.current?.dismiss();
    }
  }, [isVisible, handlePresentModalPress]);

  const handleClose = useCallback(() => {
    bottomSheetModalRef.current?.close();
    onClose?.();
  }, [onClose]);

  if (!isVisible) return null;

  return (
    <>
      <TouchableWithoutFeedback onPress={handleClose}>
        <View style={styles.overlay} />
      </TouchableWithoutFeedback>
      <BottomSheetModal
        //snapPoints={["50%"]}
        ref={bottomSheetModalRef}
        onDismiss={onClose}
        backgroundStyle={styles.modalBackground}
      >
        <BottomSheetView>{children}</BottomSheetView>
      </BottomSheetModal>
    </>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 1,
  },
  modalBackground: {
    backgroundColor: "white",
  },
});

export default BottonSheet;
