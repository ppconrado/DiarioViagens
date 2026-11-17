import { useRef, useState } from "react";
import { ActivityIndicator, Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as MediaLibrary from "expo-media-library/legacy";
import { Ionicons } from "@expo/vector-icons";
import { colors, fonts } from "@/src/theme/colors";

type CameraModalProps = { visible: boolean; onClose: () => void; onCaptured: (uri: string) => void };

export function CameraModal({ visible, onClose, onCaptured }: CameraModalProps) {
  const cameraRef = useRef<CameraView>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [cameraReady, setCameraReady] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const capture = async () => {
    if (!cameraReady || !cameraRef.current) return;
    setSaving(true);
    setError(null);
    try {
      const picture = await cameraRef.current.takePictureAsync({ quality: 0.86 });
      if (!picture?.uri) throw new Error("A câmera não retornou uma foto.");
      let finalUri = picture.uri;
      const mediaPermission = await MediaLibrary.requestPermissionsAsync(true, ["photo"]);
      if (!mediaPermission.granted) {
        setError("A permissão para salvar na galeria foi negada. Ative o acesso às fotos nas configurações.");
        return;
      }
      const savedAsset = await MediaLibrary.createAssetAsync(picture.uri);
      finalUri = savedAsset.uri;
      onCaptured(finalUri);
    } catch {
      setError("Não foi possível registrar ou salvar a foto. Tente novamente.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose} statusBarTranslucent>
      <View style={styles.screen}>
        <View style={styles.topBar}>
          <Pressable accessibilityRole="button" accessibilityLabel="Fechar câmera" onPress={onClose} style={styles.closeButton}><Ionicons name="close" size={23} color={colors.text} /></Pressable>
          <Text style={styles.title}>Nova lembrança</Text>
          <View style={styles.closeButton} />
        </View>
        {!permission?.granted ? (
          <View style={styles.permissionCard}>
            <Ionicons name="camera-outline" size={34} color={colors.primary} />
            <Text style={styles.permissionTitle}>Permita o acesso à câmera</Text>
            <Text style={styles.permissionCopy}>A câmera será usada somente para registrar a foto deste lugar.</Text>
            {permission?.canAskAgain ? <Pressable onPress={() => void requestPermission()} style={styles.permissionButton}><Text style={styles.permissionButtonText}>Permitir câmera</Text></Pressable> : <Text style={styles.error}>Permissão negada. Ative a câmera nas configurações do dispositivo.</Text>}
          </View>
        ) : (
          <View style={styles.cameraWrap}>
            <CameraView ref={cameraRef} style={styles.camera} facing="back" onCameraReady={() => setCameraReady(true)} onMountError={() => setError("A câmera não pôde ser iniciada neste dispositivo.")} />
            <View pointerEvents="none" style={styles.frame} />
            {error ? <Text accessibilityRole="alert" style={styles.error}>{error}</Text> : null}
            <View style={styles.controls}>
              <Text style={styles.hint}>Enquadre o lugar e toque para registrar</Text>
              <Pressable accessibilityRole="button" accessibilityLabel="Capturar foto" disabled={!cameraReady || saving} onPress={() => void capture()} style={[styles.shutter, (!cameraReady || saving) && styles.disabled]}>
                {saving ? <ActivityIndicator color={colors.background} /> : <View style={styles.shutterInner} />}
              </Pressable>
              <Text style={styles.saveNote}>A foto será salva na galeria</Text>
            </View>
          </View>
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  topBar: { height: 64, paddingHorizontal: 18, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  closeButton: { width: 38, height: 38, alignItems: "center", justifyContent: "center" },
  title: { color: colors.text, fontFamily: fonts.semibold, fontSize: 15 },
  permissionCard: { flex: 1, alignItems: "center", justifyContent: "center", padding: 32, gap: 14 },
  permissionTitle: { color: colors.text, fontFamily: fonts.semibold, fontSize: 18, textAlign: "center" },
  permissionCopy: { color: colors.muted, fontFamily: fonts.regular, fontSize: 13, textAlign: "center", lineHeight: 20 },
  permissionButton: { marginTop: 8, backgroundColor: colors.primary, paddingHorizontal: 20, paddingVertical: 13, borderRadius: 15 },
  permissionButtonText: { color: colors.background, fontFamily: fonts.semibold, fontSize: 13 },
  cameraWrap: { flex: 1, overflow: "hidden", borderTopLeftRadius: 28, borderTopRightRadius: 28 },
  camera: { flex: 1 },
  frame: { position: "absolute", left: 24, right: 24, top: 48, bottom: 210, borderWidth: 1, borderColor: "#FFFFFF66", borderRadius: 28 },
  controls: { position: "absolute", left: 0, right: 0, bottom: 28, alignItems: "center", gap: 15 },
  hint: { color: colors.text, fontFamily: fonts.medium, fontSize: 12, backgroundColor: "#0E1628CC", borderRadius: 20, paddingHorizontal: 14, paddingVertical: 9 },
  shutter: { width: 76, height: 76, borderRadius: 40, borderWidth: 4, borderColor: colors.white, alignItems: "center", justifyContent: "center", backgroundColor: "#0E162888" },
  shutterInner: { width: 56, height: 56, borderRadius: 30, backgroundColor: colors.primary },
  saveNote: { color: colors.text, fontFamily: fonts.regular, fontSize: 11 },
  error: { color: colors.danger, fontFamily: fonts.medium, fontSize: 12, textAlign: "center", paddingHorizontal: 20, marginTop: 12 },
  disabled: { opacity: 0.5 },
});
