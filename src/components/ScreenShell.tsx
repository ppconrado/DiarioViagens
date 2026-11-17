import type { PropsWithChildren, ReactNode } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "@/src/theme/colors";

type ScreenShellProps = PropsWithChildren<{
  scroll?: boolean;
  contentContainerStyle?: object;
  footer?: ReactNode;
}>;

export function ScreenShell({ children, scroll = true, contentContainerStyle, footer }: ScreenShellProps) {
  return (
    <SafeAreaView edges={["top", "left", "right"]} style={styles.safe}>
      {scroll ? (
        <ScrollView contentContainerStyle={[styles.content, contentContainerStyle]} showsVerticalScrollIndicator={false}>
          {children}
        </ScrollView>
      ) : (
        <View style={[styles.content, styles.fill, contentContainerStyle]}>{children}</View>
      )}
      {footer}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: 22, paddingTop: 18, paddingBottom: 28, gap: 20 },
  fill: { flex: 1 },
});
