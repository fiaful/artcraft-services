import type { CraftAppSlug } from "./crafting-apps";

// GitHub releases for the Crafting Apps, which drive every download button on
// the /apps pages.
//
// To bump an app: change its version in CRAFT_APP_RELEASES (each app has its
// own, e.g. `craftRelease("0.4.0")`).
// To hide an app's downloads (Discord waitlist instead): set it to null.
// If a release renames, adds or drops files, edit CRAFT_RELEASE_ASSETS, or
// pass a custom list as craftRelease's second argument for a single app.
//
// Release tags are `v<version>` and live at github.com/storytold/<slug>.

export type CraftDesktopPlatform = "macOS" | "Windows" | "Linux" | "FreeBSD";

/** Order of the per-platform download buttons. */
export const CRAFT_DESKTOP_PLATFORMS: CraftDesktopPlatform[] = ["macOS", "Windows", "Linux", "FreeBSD"];

export type CraftReleaseAsset = {
  /** Asset filename; `{slug}` and `{version}` are filled in per app. */
  file: string;
  /** Group in the full file list. "Other" holds the web build and checksums. */
  group: CraftDesktopPlatform | "Other";
  /** Short name, e.g. "Installer (x64)". */
  label: string;
  /** One line on who should pick this file. */
  description: string;
  /** CPU architecture, used to choose between recommended Linux builds. */
  arch?: "universal" | "x64" | "x86_64" | "aarch64" | "riscv64";
  /**
   * Offered as a platform's main download button. The first recommended
   * asset in a group is the default; a later one wins only when its `arch`
   * matches the visitor's detected CPU.
   */
  recommended?: boolean;
};

export type CraftRelease = {
  /** Version without the leading "v", e.g. "0.2.0". */
  version: string;
  /** Git tag. Defaults to `v<version>`. */
  tag?: string;
  /** Fills `{slug}` in filenames. Defaults to the app's slug; a release from before a rename keeps the old one. */
  fileSlug?: string;
  assets: readonly CraftReleaseAsset[];
};

// The file set every Crafting App publishes, in display order within each group.
// Windows builds are x64 and ARM64 only; 32-bit Windows is no longer shipped.
export const CRAFT_RELEASE_ASSETS: readonly CraftReleaseAsset[] = [
  {
    file: "{slug}-{version}-macos-universal.dmg",
    group: "macOS",
    label: "Disk image (Universal)",
    description: "Apple silicon and Intel Macs.",
    arch: "universal",
    recommended: true,
  },
  {
    file: "{slug}-cli-{version}-macos-universal.zip",
    group: "macOS",
    label: "Command-line tool (Universal)",
    description: "The headless CLI for scripts and agents.",
    arch: "universal",
  },
  {
    file: "{slug}-{version}-windows-x64.msi",
    group: "Windows",
    label: "Installer (64-bit)",
    description: "Most Windows 10 and 11 PCs.",
    arch: "x64",
    recommended: true,
  },
  {
    file: "{slug}-{version}-windows-x64-portable.zip",
    group: "Windows",
    label: "Portable (64-bit)",
    description: "Unzip and run, no install.",
    arch: "x64",
  },
  {
    file: "{slug}-{version}-windows-arm64.msi",
    group: "Windows",
    label: "Installer (ARM64)",
    description: "Windows 11 on ARM laptops.",
    arch: "aarch64",
  },
  {
    file: "{slug}-{version}-windows-arm64-portable.zip",
    group: "Windows",
    label: "Portable (ARM64)",
    description: "Unzip and run on Windows on ARM.",
    arch: "aarch64",
  },
  {
    file: "{slug}-{version}-linux-x86_64.flatpak",
    group: "Linux",
    label: "Flatpak (x86_64)",
    description: "Sandboxed. Install with flatpak install --user.",
    arch: "x86_64",
    recommended: true,
  },
  {
    file: "{slug}-{version}-linux-x86_64.AppImage",
    group: "Linux",
    label: "AppImage (x86_64)",
    description: "Any distro. Mark it executable and run.",
    arch: "x86_64",
  },
  {
    file: "{slug}-{version}-linux-x86_64.deb",
    group: "Linux",
    label: "Debian package (x86_64)",
    description: "Debian, Ubuntu and derivatives.",
    arch: "x86_64",
  },
  {
    file: "{slug}-{version}-linux-x86_64.rpm",
    group: "Linux",
    label: "RPM package (x86_64)",
    description: "Fedora, RHEL and openSUSE.",
    arch: "x86_64",
  },
  {
    file: "{slug}-{version}-linux-x86_64.tar.gz",
    group: "Linux",
    label: "Tarball (x86_64)",
    description: "Plain binaries to unpack anywhere.",
    arch: "x86_64",
  },
  {
    file: "{slug}-{version}-linux-aarch64.flatpak",
    group: "Linux",
    label: "Flatpak (ARM64)",
    description: "Sandboxed, on 64-bit ARM.",
    arch: "aarch64",
    recommended: true,
  },
  {
    file: "{slug}-{version}-linux-aarch64.AppImage",
    group: "Linux",
    label: "AppImage (ARM64)",
    description: "Any distro on 64-bit ARM.",
    arch: "aarch64",
  },
  {
    file: "{slug}-{version}-linux-aarch64.deb",
    group: "Linux",
    label: "Debian package (ARM64)",
    description: "Debian, Ubuntu and derivatives on ARM.",
    arch: "aarch64",
  },
  {
    file: "{slug}-{version}-linux-aarch64.rpm",
    group: "Linux",
    label: "RPM package (ARM64)",
    description: "Fedora, RHEL and openSUSE on ARM.",
    arch: "aarch64",
  },
  {
    file: "{slug}-{version}-linux-aarch64.tar.gz",
    group: "Linux",
    label: "Tarball (ARM64)",
    description: "Plain binaries for 64-bit ARM.",
    arch: "aarch64",
  },
  // Keep literal filenames here: the release updater extracts them from this array.
  ...[
    { file: "{slug}-{version}-linux-riscv64.tar.gz", label: "Tarball", description: "Plain binaries for 64-bit RISC-V.", recommended: true },
    { file: "{slug}-{version}-linux-riscv64.deb", label: "Debian package", description: "Debian and derivatives on 64-bit RISC-V." },
    { file: "{slug}-{version}-linux-riscv64.rpm", label: "RPM package", description: "RPM-based distributions on 64-bit RISC-V." },
  ].map(({ file, label, description, recommended }): CraftReleaseAsset => ({
    file,
    group: "Linux",
    label: `${label} (RISC-V 64)`,
    description,
    arch: "riscv64",
    recommended,
  })),
  {
    file: "{slug}-{version}-linux-x86_64.pkg.tar.zst",
    group: "Linux",
    label: "Arch package (x86_64)",
    description: "Arch Linux, Manjaro, and derivatives.",
    arch: "x86_64",
  },
  {
    file: "{slug}-{version}-linux-aarch64.pkg.tar.zst",
    group: "Linux",
    label: "Arch package (ARM64)",
    description: "Arch Linux ARM and derivatives on 64-bit ARM.",
    arch: "aarch64",
  },
  {
    file: "{slug}-web-{version}.zip",
    group: "Other",
    label: "Web build",
    description: "The WebAssembly app, to host yourself.",
  },
  {
    file: "SHA256SUMS.txt",
    group: "Other",
    label: "SHA-256 checksums",
    description: "Verify any download above.",
  },
  {
    file: "{slug}-{version}-freebsd-x86_64.tar.gz",
    group: "FreeBSD",
    label: "FreeBSD (x86_64)",
    description: "Plain binaries for FreeBSD 15.1.",
    arch: "x86_64",
    recommended: true,
  },
];

export function craftRelease(
  version: string,
  assets: readonly CraftReleaseAsset[] = CRAFT_RELEASE_ASSETS,
): CraftRelease {
  return { version, assets };
}

// ArtCraft Launcher (github.com/storytold/craft-launcher) installs and updates
// every app above, and the /apps pages recommend it first. Its releases ship
// the same file set minus the macOS CLI, named artcraft-launcher-*.
export const CRAFT_LAUNCHER_RELEASE: CraftRelease | null = craftRelease(
  "0.20.3",
  CRAFT_RELEASE_ASSETS
    .filter((asset) => !asset.file.startsWith("{slug}-cli-"))
    // The launcher's RISC-V binary needs glibc 2.39, including in its tarball.
    // Keep this launcher-specific; the other apps have their own release floors.
    .map((asset) => asset.arch === "riscv64"
      ? { ...asset, description: `${asset.description} Requires glibc 2.39 or newer.` }
      : asset),
);

// Every app must be listed, so a new slug fails the type check until it is.
export const CRAFT_APP_RELEASES: Record<CraftAppSlug, CraftRelease | null> = {
  photocraft: craftRelease("0.23.1"),
  vectorcraft: craftRelease("0.24.1"),
  filmcraft: craftRelease("0.20.1"),
  lightcraft: craftRelease("0.21.1"),
  pdfcraft: craftRelease("0.22.0"),
  effectcraft: craftRelease("0.25.1"),
  // AniCraft publishes no web ZIP build yet.
  anicraft: craftRelease("0.3.0", CRAFT_RELEASE_ASSETS.filter(
    (asset) => !asset.file.startsWith("{slug}-web-"),
  )),
  designcraft: craftRelease("0.21.1"),
  figcraft: craftRelease("0.18.1"),
  texturecraft: craftRelease("0.6.1"),
  materialcraft: craftRelease("0.4.1"),
  wordcraft: craftRelease("0.19.1"),
  soundcraft: craftRelease("0.20.1"),
  deckcraft: craftRelease("0.19.1"),
  cadcraft: craftRelease("0.20.1"),
  gridcraft: craftRelease("0.19.1"),
  "craft-anything": craftRelease("0.6.1"),
};

export type CraftNightlyRelease = {
  /** Exact GitHub release tag of the latest nightly prerelease (any tag format). */
  tag: string;
  /** Package version used in the `-nightly-<version>-linux-<arch>` filenames. */
  version: string;
  /** True when the nightly prerelease publishes Flatpak OCI images (`nightly-<arch>`). */
  flatpak?: boolean;
  /** True when the nightly prerelease publishes AppImage binaries (`-nightly-<version>-linux-<arch>.AppImage`). */
  appImage?: boolean;
};

// Updated automatically by `.github/workflows/update-craft-release-versions.yml` from the
// newest published nightly prerelease per repository, regardless of its tag name.
export const CRAFT_NIGHTLY_RELEASES: Partial<
  Record<CraftAppSlug | "artcraft-launcher" | "artcraft", CraftNightlyRelease>
> = {};

/** Published immutable developer release; asset metadata is captured from the exact GitHub release. */
export type CraftDeveloperRelease = {
  tag: string;
  version: string;
  publishedAt: string;
  /** When the updater successfully enumerated releases from GitHub. */
  reconciledAt: string;
  assets: { name: string; size: number; sha256?: string }[];
};

// Unlike CRAFT_NIGHTLY_RELEASES (which tracks distro packages), this also tracks portable
// Windows, macOS and Linux builds. Updated by the same release reconciliation.
export const CRAFT_DEVELOPER_RELEASES: Partial<
  Record<CraftAppSlug | "artcraft-launcher" | "artcraft", CraftDeveloperRelease>
> = {
  "filmcraft": {
    "tag": "v0.20.1-nightly.20261128.46170501336.1.gd409bd8a87f7",
    "version": "0.20.1-nightly.20261128.46170501336.1.gd409bd8a87f7",
    "publishedAt": "2026-11-28T18:03:55Z",
    "reconciledAt": "2026-11-28T18:07:16.020Z",
    "assets": [
      {
        "name": "filmcraft-0.20.1-nightly.20261128.46170501336.1.gd409bd8a87f7-linux-x86_64-nightly.tar.gz",
        "size": 71148611,
        "sha256": "b8e05318afee628e09ac07928ab38f90ae2a58169ebd8fc57d1dfb19413127fb"
      },
      {
        "name": "filmcraft-0.20.1-nightly.20261128.46170501336.1.gd409bd8a87f7-linux-x86_64-nightly.tar.gz.asc",
        "size": 228,
        "sha256": "13f4432ee7f8b794350b514b823ec7c784797865c024a0ece9962f6d5424665b"
      },
      {
        "name": "filmcraft-0.20.1-nightly.20261128.46170501336.1.gd409bd8a87f7-macos-aarch64-nightly.zip",
        "size": 65797047,
        "sha256": "da7e33ccd7139404b96bc75f3e1fece95e71c45d09b97197a9da3f36e226bfbf"
      },
      {
        "name": "filmcraft-0.20.1-nightly.20261128.46170501336.1.gd409bd8a87f7-windows-x86_64-nightly.zip",
        "size": 67888320,
        "sha256": "99071da6e99b392fb95903d8ef2be7ed419623c8c6911925b9aad78e208ca94f"
      },
      {
        "name": "NIGHTLY.json",
        "size": 2512,
        "sha256": "f669fbf9b6f7d5353f29e3d3ab87c021a4b587b9173222fb386a6a97c723499d"
      },
      {
        "name": "SHA256SUMS.txt",
        "size": 709,
        "sha256": "8a127ca1a4ac385c17557e8448187f3ffc98897215fae4c11c9d056c9d8a6046"
      }
    ]
  },
  "designcraft": {
    "tag": "v0.21.1-nightly.20261128.46170255033.1.gabd40399574a",
    "version": "0.21.1-nightly.20261128.46170255033.1.gabd40399574a",
    "publishedAt": "2026-11-28T18:04:04Z",
    "reconciledAt": "2026-11-28T18:07:19.809Z",
    "assets": [
      {
        "name": "designcraft-0.21.1-nightly.20261128.46170255033.1.gabd40399574a-linux-x86_64-nightly.tar.gz",
        "size": 80731015,
        "sha256": "23c1f751198b8e2332ba7409de551e37cf0702b64c73a9d68918a3f8cb7af85f"
      },
      {
        "name": "designcraft-0.21.1-nightly.20261128.46170255033.1.gabd40399574a-linux-x86_64-nightly.tar.gz.asc",
        "size": 228,
        "sha256": "0979c8d74f0fbd8a3d7f7b7d3b6973882040921e885599e5dc362374faa1c544"
      },
      {
        "name": "designcraft-0.21.1-nightly.20261128.46170255033.1.gabd40399574a-macos-aarch64-nightly.zip",
        "size": 75842541,
        "sha256": "d68fcf58d751606b6e3b8485a893fe0efc1915311708ee959f1c5c1f551f828f"
      },
      {
        "name": "designcraft-0.21.1-nightly.20261128.46170255033.1.gabd40399574a-windows-x86_64-nightly.zip",
        "size": 75686057,
        "sha256": "2834b17479dbd1670541e09a9105b1433b72a3ae4841ebdd7acc6fb855713a04"
      },
      {
        "name": "NIGHTLY.json",
        "size": 2546,
        "sha256": "8b1ce40a4bf464f75cd6a656bbf31387d4024aad246c156a0653487c2710cfb6"
      },
      {
        "name": "SHA256SUMS.txt",
        "size": 717,
        "sha256": "af62f64f55111eb2cffbecac03e79b9f5ca0710054761bf09ca4a1ae88b95566"
      }
    ]
  },
  "materialcraft": {
    "tag": "v0.4.1-nightly.20261128.46170260755.1.ge78378a6e8c0",
    "version": "0.4.1-nightly.20261128.46170260755.1.ge78378a6e8c0",
    "publishedAt": "2026-11-28T18:03:14Z",
    "reconciledAt": "2026-11-28T18:07:21.511Z",
    "assets": [
      {
        "name": "materialcraft-0.4.1-nightly.20261128.46170260755.1.ge78378a6e8c0-linux-x86_64-nightly.tar.gz",
        "size": 46004259,
        "sha256": "995fbfdd7659c071ac0d91c74a0c9ab4a0f84ac7edfdd2889e9115637da65272"
      },
      {
        "name": "materialcraft-0.4.1-nightly.20261128.46170260755.1.ge78378a6e8c0-linux-x86_64-nightly.tar.gz.asc",
        "size": 228,
        "sha256": "077741f0d2e4a3c4504d75a021c2cb15b451f928f9b0d2bbc7bb80c1c3ab249e"
      },
      {
        "name": "materialcraft-0.4.1-nightly.20261128.46170260755.1.ge78378a6e8c0-macos-aarch64-nightly.zip",
        "size": 42273765,
        "sha256": "e7f25dabcc265d706a8d68675a52313b6efaf7d1d6fbb470d8619b5a5daa7cf4"
      },
      {
        "name": "materialcraft-0.4.1-nightly.20261128.46170260755.1.ge78378a6e8c0-windows-x86_64-nightly.zip",
        "size": 43629250,
        "sha256": "f53aadc5423b4efa3ca0fd8af8efd7fe681f15222af9cfa31e763f8d2f13e8b0"
      },
      {
        "name": "NIGHTLY.json",
        "size": 2567,
        "sha256": "0c9d624d7a603010cb2edafff0bbab613050d74588543ea2ef9f5be4d27b3b54"
      },
      {
        "name": "SHA256SUMS.txt",
        "size": 721,
        "sha256": "4103980e7cc4a4dd7233037e5efe0cd84c29bce2d28ac995f56d31cae5cfa849"
      }
    ]
  },
  "soundcraft": {
    "tag": "v0.20.1-nightly.20261128.46170257643.1.g865baa99f193",
    "version": "0.20.1-nightly.20261128.46170257643.1.g865baa99f193",
    "publishedAt": "2026-11-28T18:02:39Z",
    "reconciledAt": "2026-11-28T18:07:22.966Z",
    "assets": [
      {
        "name": "NIGHTLY.json",
        "size": 2529,
        "sha256": "580bbfcabb32fedccc956c3e25c1d50132595fb8dfbcf9952c1da4a5214806d4"
      },
      {
        "name": "SHA256SUMS.txt",
        "size": 713,
        "sha256": "7f6128b6089910bc707afbba27e69b0b5c8f6c2207aae0d08d07190b207cba75"
      },
      {
        "name": "soundcraft-0.20.1-nightly.20261128.46170257643.1.g865baa99f193-linux-x86_64-nightly.tar.gz",
        "size": 26953435,
        "sha256": "c969120b3208904fa88276d37e74ee489dc4a0ca9e6592ca36ad931c5ce95649"
      },
      {
        "name": "soundcraft-0.20.1-nightly.20261128.46170257643.1.g865baa99f193-linux-x86_64-nightly.tar.gz.asc",
        "size": 228,
        "sha256": "89d13652420aeda4edb45b384a27f319eef3ce77f6b2809d3b6a9f98f2318dee"
      },
      {
        "name": "soundcraft-0.20.1-nightly.20261128.46170257643.1.g865baa99f193-macos-aarch64-nightly.zip",
        "size": 21657273,
        "sha256": "a7cb12e762284acf2dda4b3b63cb520113102ba52ab8db4a12165775f9bcefc6"
      },
      {
        "name": "soundcraft-0.20.1-nightly.20261128.46170257643.1.g865baa99f193-windows-x86_64-nightly.zip",
        "size": 21689916,
        "sha256": "8ea51c18d75d44954c1cd892736e18e3521823ba3db0734bc0e82b63112ed670"
      }
    ]
  },
  "deckcraft": {
    "tag": "v0.19.1-nightly.20261128.46170252267.1.g274ec864ec71",
    "version": "0.19.1-nightly.20261128.46170252267.1.g274ec864ec71",
    "publishedAt": "2026-11-28T18:03:12Z",
    "reconciledAt": "2026-11-28T18:07:23.641Z",
    "assets": [
      {
        "name": "deckcraft-0.19.1-nightly.20261128.46170252267.1.g274ec864ec71-linux-x86_64-nightly.tar.gz",
        "size": 66478217,
        "sha256": "c8c113138893d9cb4a03281284b156769c920e225064e3fa111c9d2ce8568c37"
      },
      {
        "name": "deckcraft-0.19.1-nightly.20261128.46170252267.1.g274ec864ec71-linux-x86_64-nightly.tar.gz.asc",
        "size": 228,
        "sha256": "07ec0c7f44d74bc759334998b4fa3b99845872b38e49f7a5d201996084a913c7"
      },
      {
        "name": "deckcraft-0.19.1-nightly.20261128.46170252267.1.g274ec864ec71-macos-aarch64-nightly.zip",
        "size": 61198207,
        "sha256": "df13623bfe4b6e56e001fbf130fa70e55bedabc3e9dbb581deffa30faf144d47"
      },
      {
        "name": "deckcraft-0.19.1-nightly.20261128.46170252267.1.g274ec864ec71-windows-x86_64-nightly.zip",
        "size": 61493184,
        "sha256": "5b69e2ce6712ce50f4dc01b4917b7a178c62befdd73d68904845b5a23a54474b"
      },
      {
        "name": "NIGHTLY.json",
        "size": 2512,
        "sha256": "75979b4304dcd490e41f6d074c6d52252e9aa727b859ce6f81e6dfff1d8536c7"
      },
      {
        "name": "SHA256SUMS.txt",
        "size": 709,
        "sha256": "1683e371ba913a610f2592f98dd2fc40763ae250217d7ff3584614abf5214385"
      }
    ]
  },
  "cadcraft": {
    "tag": "v0.20.1-nightly.20261127.46074241695.1.gf7adf3ad561c",
    "version": "0.20.1-nightly.20261127.46074241695.1.gf7adf3ad561c",
    "publishedAt": "2026-11-27T22:48:29Z",
    "reconciledAt": "2026-11-28T18:07:24.411Z",
    "assets": [
      {
        "name": "cadcraft-0.20.1-nightly.20261127.46074241695.1.gf7adf3ad561c-linux-x86_64-nightly.tar.gz",
        "size": 59581116,
        "sha256": "259683ed5e3375b7adbf2e70318d8b2247a845262967f0b56e6962439f026e44"
      },
      {
        "name": "cadcraft-0.20.1-nightly.20261127.46074241695.1.gf7adf3ad561c-linux-x86_64-nightly.tar.gz.asc",
        "size": 228,
        "sha256": "0f8a90a8aa3fd08ce438a374d27b8c73f02a3972014a20957005726fdcf55564"
      },
      {
        "name": "cadcraft-0.20.1-nightly.20261127.46074241695.1.gf7adf3ad561c-macos-aarch64-nightly.zip",
        "size": 53252336,
        "sha256": "13a2344f2de2a09b50aaf22c498b3ef103b5d61fdc315d5dc7b74eba7558a239"
      },
      {
        "name": "cadcraft-0.20.1-nightly.20261127.46074241695.1.gf7adf3ad561c-windows-x86_64-nightly.zip",
        "size": 53612594,
        "sha256": "5eda8ce2851e308ce6ba2cda50820e8ef32af1f80bb70daf301079ee878fb5c8"
      },
      {
        "name": "NIGHTLY.json",
        "size": 2495,
        "sha256": "28414a91a8ff492a83c2611009347cf9e048e3387d734f6f09a7cc7cfbcb335f"
      },
      {
        "name": "SHA256SUMS.txt",
        "size": 705,
        "sha256": "f4ffa36b700d8401f2367514cb74e8ba4b11f1c75fd791a12781cecf50119a70"
      }
    ]
  },
  "gridcraft": {
    "tag": "v0.19.1-nightly.20261128.46170249690.1.gf2934fd0096d",
    "version": "0.19.1-nightly.20261128.46170249690.1.gf2934fd0096d",
    "publishedAt": "2026-11-28T17:53:15Z",
    "reconciledAt": "2026-11-28T18:07:25.149Z",
    "assets": [
      {
        "name": "gridcraft-0.19.1-nightly.20261128.46170249690.1.gf2934fd0096d-linux-x86_64-nightly.tar.gz",
        "size": 56263176,
        "sha256": "40fb33b9be94109a4f60a400a316230c8b650380e8ae9647409b5d11a740a158"
      },
      {
        "name": "gridcraft-0.19.1-nightly.20261128.46170249690.1.gf2934fd0096d-linux-x86_64-nightly.tar.gz.asc",
        "size": 228,
        "sha256": "1fcb7e5a3529977b010b7e85fde53ef06a476f30fd68b2ed3b79dd183e25d8c0"
      },
      {
        "name": "gridcraft-0.19.1-nightly.20261128.46170249690.1.gf2934fd0096d-macos-aarch64-nightly.zip",
        "size": 51454803,
        "sha256": "1b6f6134738ff4368f860011457326176b1c37c139de42739f26905b38b10663"
      },
      {
        "name": "gridcraft-0.19.1-nightly.20261128.46170249690.1.gf2934fd0096d-windows-x86_64-nightly.zip",
        "size": 51369923,
        "sha256": "4721bc5f12b68d29bc2da87482419a43024ed2676063935395049ad3c2a0395f"
      },
      {
        "name": "NIGHTLY.json",
        "size": 2512,
        "sha256": "d52ba306d1af4f615fb6ae4343beff3cd108e6480ace5509cc738a559cbf4d26"
      },
      {
        "name": "SHA256SUMS.txt",
        "size": 709,
        "sha256": "27c22955f944c5be4536b2624a524f4e47dd4d5170042645742391a7a3012339"
      }
    ]
  }
};

export type CraftChannelRelease = {
  /** Exact GitHub release tag (e.g. "v0.24.0-rc.1" or "v0.23.1"). */
  tag: string;
  /** Version without the leading "v" (e.g. "0.24.0-rc.1" or "0.23.1"). */
  version: string;
};

// Highest-version non-nightly beta/RC prerelease per repository, updated automatically by
// `.github/workflows/update-craft-release-versions.yml`.
export const CRAFT_PRERELEASE_RELEASES: Partial<
  Record<CraftAppSlug | "artcraft-launcher", CraftChannelRelease>
> = {
  photocraft: { tag: "v0.24.0-rc.2", version: "0.24.0-rc.2" },
};

export type CraftCommunityAppReleases = {
  /** GitHub repository (`owner/repo`), matching the craft-launcher-assets catalog. */
  repo: string;
  stable?: CraftChannelRelease;
  prerelease?: CraftChannelRelease;
  nightly?: CraftChannelRelease;
};

// Community apps listed in the craft-launcher-assets catalog, updated automatically by
// `.github/workflows/update-craft-release-versions.yml`.
export const CRAFT_COMMUNITY_RELEASES: Record<string, CraftCommunityAppReleases> = {
  solidcraft: { repo: "tangency-labs/solidcraft", stable: { tag: "v0.51.2", version: "0.51.2" }, prerelease: { tag: "v0.51.0", version: "0.51.0" }, nightly: { tag: "v0.51.0-nightly.20261127.168.1", version: "0.51.0-nightly.20261127.168.1" } },
  mailcraft: { repo: "UCSLabs/mailcraft", stable: { tag: "v0.15.0", version: "0.15.0" } },
};
