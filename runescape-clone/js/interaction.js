// --- INTERACTION MODULE ---
function setupInteraction(game) {
    window.addEventListener('pointerdown', (event) => onPointerDown(event, game));
}

function onPointerDown(event, game) {
    if (event.target.tagName === 'BUTTON') return; // Ignore UI clicks
    game.pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    game.pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
    game.raycaster.setFromCamera(game.pointer, game.camera);
    const intersects = game.raycaster.intersectObjects(game.scene.children, true);

    console.log('Total intersections:', intersects.length);

    if (intersects.length > 0) {
        let target = null;
        let point = null;

        // First, check ALL intersections for resources/NPCs
        for (let hit of intersects) {
            console.log('Checking object:', hit.object.name, 'userData:', hit.object.userData);
            let obj = hit.object;

            // Check the object itself first
            if (obj.userData && (obj.userData.type === 'resource' || obj.userData.type === 'npc')) {
                target = obj;
                point = hit.point;
                console.log('Found resource/NPC on object itself!');
                break;
            }

            // Traverse up the parent chain to find resource/NPC groups
            while (obj.parent && obj.parent.type !== 'Scene') {
                obj = obj.parent;
                console.log('Checking parent:', obj.name, 'userData:', obj.userData);
                if (obj.userData && (obj.userData.type === 'resource' || obj.userData.type === 'npc')) {
                    target = obj;
                    point = hit.point;
                    console.log('Found resource/NPC on parent!');
                    break;
                }
            }
            // If we found a resource/NPC, stop searching
            if (target) break;
        }

        // If no resource/NPC found, check for ground
        if (!target) {
            for (let hit of intersects) {
                if (hit.object.name === 'ground') {
                    target = hit.object;
                    point = hit.point;
                    console.log('Using ground as target');
                    break;
                }
            }
        }

        console.log('Final target:', target ? target.name : 'none', 'type:', target?.userData?.type);
        if (target) handleInteraction(target, point, game);
    }
}

function handleInteraction(target, point, game) {
    if (target.name === 'ground') {
        game.player.targetPosition = point;
        game.player.interactionTarget = null; // Cancel any pending interaction
        addMessage("Walking...", "action");
    } else if (target.userData.type === 'resource') {
        game.player.targetPosition = point;
        game.player.interactionTarget = target; // Set the tree as interaction target
        addMessage("Walking to resource...", "action");
    } else if (target.userData.type === 'npc') {
        game.player.targetPosition = point;
        game.player.interactionTarget = target; // Set the NPC as interaction target
        addMessage("Walking to NPC...", "action");
    }
}

function gatherResource(obj) {
    if (game.player.state === 'chopping' || game.player.state === 'mining') return; // Already gathering

    const type = obj.userData.resourceType;
    const skill = type === 'wood' ? 'woodcutting' : 'mining';
    const action = type === 'wood' ? 'Chopping' : 'Mining';

    addMessage(`${action} ${obj.userData.name}...`, "action");
    game.player.state = type === 'wood' ? 'chopping' : 'mining';

    // Random number of swings (5 to 10)
    const swings = Math.floor(Math.random() * 6) + 5;
    let count = 0;

    const interval = setInterval(() => {
        count++;
        if (count >= swings) {
            clearInterval(interval);
            game.player.state = 'idle';
            addMessage(`You get some ${type}.`, "normal");
            addXP(skill, obj.userData.xp);

            if (type === 'wood') addLog();
            else addOre();

            // Hide and Respawn
            obj.visible = false;
            setTimeout(() => {
                obj.visible = true;
            }, 5000 + Math.random() * 5000); // 5-10 seconds respawn
        }
    }, 1000); // 1 swing per second
}
