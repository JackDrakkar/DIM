import { D2ManifestDefinitions } from 'app/destiny2/d2-definitions';
import { DefItemIcon } from 'app/inventory/ItemIcon';
import React, { Dispatch } from 'react';
import { LoadoutBuilderAction } from '../loadout-builder-reducer';
import { LockedExoticWithPlugs } from '../types';
import styles from './ExoticTile.m.scss';

interface Props {
  defs: D2ManifestDefinitions;
  exotic: LockedExoticWithPlugs;
  lbDispatch: Dispatch<LoadoutBuilderAction>;
  onClose(): void;
}

/**
 * A square tile container the exotic name, icon, and perk/mods info.
 *
 * When rendering perks a short description will be pulled from the SandboxPerk definition.
 * Mods on the other hand only get a name and icon as multiple descriptions takes up too
 * much room on screen.
 */
function ExoticTile({ defs, exotic, lbDispatch, onClose }: Props) {
  const { def, exoticPerk, exoticMods } = exotic;
  let perkShortDescription = exoticPerk?.displayProperties.description;

  if (exoticPerk) {
    for (const perk of exoticPerk.perks) {
      const description = defs.SandboxPerk.get(perk.perkHash)?.displayProperties.description;
      if (description) {
        perkShortDescription = description;
        break;
      }
    }
  }

  return (
    <div
      className={styles.exotic}
      onClick={() => {
        lbDispatch({ type: 'lockExotic', lockedExotic: exotic });
        onClose();
      }}
    >
      <div className={styles.itemName}>{def.displayProperties.name}</div>
      <div className={styles.details}>
        <div className={styles.itemImage}>
          <DefItemIcon itemDef={def} defs={defs} />
        </div>
        {exoticPerk && (
          <div key={exoticPerk.hash} className={styles.perkOrModInfo}>
            <div className={styles.perkOrModNameAndImage}>
              <DefItemIcon className={styles.perkOrModImage} itemDef={exoticPerk} defs={defs} />
              <div className={styles.perkOrModName}>{exoticPerk.displayProperties.name}</div>
            </div>
            <div className={styles.perkDescription}>{perkShortDescription}</div>
          </div>
        )}
        <div className={styles.mods}>
          {exoticMods?.map((mod) => (
            <div key={mod.hash} className={styles.perkOrModInfo}>
              <div className={styles.perkOrModNameAndImage}>
                <DefItemIcon className={styles.perkOrModImage} itemDef={mod} defs={defs} />
                <div className={styles.perkOrModName}>{mod.displayProperties.name}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ExoticTile;
