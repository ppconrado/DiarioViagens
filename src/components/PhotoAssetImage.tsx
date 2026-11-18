import { useEffect, useState } from "react";
import { Image, type ImageStyle, type StyleProp } from "react-native";
import * as MediaLibrary from "expo-media-library/legacy";

type PhotoAssetImageProps = {
  assetId: string | null;
  style: StyleProp<ImageStyle>;
};

export function PhotoAssetImage({ assetId, style }: PhotoAssetImageProps) {
  const [resolved, setResolved] = useState<{ assetId: string; uri: string } | null>(null);

  useEffect(() => {
    let active = true;
    if (!assetId) return () => { active = false; };

    MediaLibrary.getAssetInfoAsync(assetId)
      .then((asset) => {
        const uri = asset.localUri ?? asset.uri ?? null;
        if (active && uri) setResolved({ assetId, uri });
      })
      .catch(() => {
        if (active) setResolved(null);
      });

    return () => { active = false; };
  }, [assetId]);

  const uri = assetId && resolved?.assetId === assetId ? resolved.uri : null;
  return uri ? <Image source={{ uri }} style={style} /> : null;
}
