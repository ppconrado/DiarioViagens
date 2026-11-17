import { useEffect, useState } from "react";
import { Image, type ImageStyle, type StyleProp } from "react-native";
import * as MediaLibrary from "expo-media-library/legacy";

type PhotoAssetImageProps = {
  assetId: string | null;
  legacyUri?: string | null;
  style: StyleProp<ImageStyle>;
};

export function PhotoAssetImage({ assetId, legacyUri, style }: PhotoAssetImageProps) {
  const [resolvedUri, setResolvedUri] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    if (!assetId) return () => { active = false; };

    MediaLibrary.getAssetInfoAsync(assetId)
      .then((asset) => {
        if (active) setResolvedUri(asset.localUri ?? asset.uri ?? legacyUri ?? null);
      })
      .catch(() => {
        if (active) setResolvedUri(legacyUri ?? null);
      });

    return () => { active = false; };
  }, [assetId, legacyUri]);

  const uri = assetId ? resolvedUri : legacyUri ?? null;
  return uri ? <Image source={{ uri }} style={style} /> : null;
}
