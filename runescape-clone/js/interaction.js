import * as THREE from 'three';
import { addLog, addOre, addMessage } from './ui.js';
import { addXP } from './skills.js';
import { interactWithNPC } from './npc.js';

export function setupInteraction(game) {
    window.addEventListener('pointerdown', (event) => onPointerDown(event, game));
}

function onPointerDown(event, game) {
    // Calculate pointer position in normalized device coordinates (-1 to +1)
    game.pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    game.pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

    game.raycaster.setFromCamera(game.pointer, game.camera);

    const intersects = game.raycaster.intersectObjects(game.scene.children, true);

    if (intersects.length > 0) {
        // Find the first relevant object
        let target = null;
        let point = null;

        for (let hit of intersects) {
            let obj = hit.object;
            // Traverse up to find the group or object with userData
            while (obj.parent && obj.parent.type !== 'Scene') {
                if (obj.userData && (obj.userData.type === 'resource' || obj.userData.type === 'npc')) {
                    target = obj;
                    break;
                }
                obj = obj.parent;
            }
            if (target) {
                point = hit.point;
                break;
            }

            // Check ground
            if (hit.object.name === 'ground') {
                target = hit.object;
                point = hit.point;
                break;
            }
        }

        if (target) {
            handleInteraction(target, point, game);
        }
    }
}

function handleInteraction(target, point, game) {
    if (target.userData.type === 'resource') {
        // Move to resource
        game.player.targetPosition = point;

        setTimeout(() => {
            const dist = game.player.mesh.position.distanceTo(point);
            if (dist < 3.0) {
                gatherResource(target);
            }
        }, 1000);
    } else if (target.name === 'ground') {
        // Move to point
        game.player.targetPosition = point;
    } else if (target.userData.type === 'npc') {
        // Move to NPC
        game.player.targetPosition = point;

        setTimeout(() => {
            const dist = game.player.mesh.position.distanceTo(point);
            if (dist < 3.0) {
                interactWithNPC(target);
            }
        }, 1000);
    }
}

function gatherResource(obj) {
    const type = obj.userData.resourceType;
    const name = obj.userData.name;
    const xp = obj.userData.xp;

    addMessage(`You swing at the ${name}...`, "action");

    setTimeout(() => {
        if (type === 'wood') {
            addMessage("You get some logs.", "system");
            addLog();
            addXP('woodcutting', xp);
        } else if (type === 'ore') {
            addMessage("You get some copper ore.", "system");
            addOre();
            addXP('mining', xp);
        }

        // Respawn logic
        obj.visible = false;
        setTimeout(() => {
            obj.visible = true;
        }, 5000);
    }, 1000);
}
