using UnityEngine;
using System;

namespace Mahjong.Unity
{
    public class MobileInput : MonoBehaviour
    {
        public Camera MainCamera;
        public LayerMask TileLayer; // Assign "Default" or a specific layer for tiles

        public event Action<TileVisual> OnTileSelected;
        public event Action<TileVisual> OnTileConfirmed; // Second tap to discard

        private TileVisual _selectedTile;

        void Update()
        {
            if (Input.GetMouseButtonDown(0)) // Works for Touch on Mobile too
            {
                HandleInput(Input.mousePosition);
            }
            else if (Input.touchCount > 0)
            {
                Touch touch = Input.GetTouch(0);
                if (touch.phase == TouchPhase.Began)
                {
                    HandleInput(touch.position);
                }
            }
        }

        private void HandleInput(Vector3 screenPos)
        {
            Ray ray = MainCamera.ScreenPointToRay(screenPos);
            if (Physics.Raycast(ray, out RaycastHit hit, 100f, TileLayer))
            {
                TileVisual tile = hit.collider.GetComponent<TileVisual>();
                if (tile != null)
                {
                    if (_selectedTile == tile)
                    {
                        // Tapped same tile twice -> Confirm
                        OnTileConfirmed?.Invoke(tile);
                        _selectedTile = null; // Reset selection
                        // Optional: Reset visual state of tile
                    }
                    else
                    {
                        // New selection
                        if (_selectedTile != null)
                        {
                            // Deselect previous
                            // _selectedTile.SetSelected(false); 
                        }
                        
                        _selectedTile = tile;
                        OnTileSelected?.Invoke(tile);
                        // tile.SetSelected(true); // Visual feedback (pop up)
                    }
                }
            }
            else
            {
                // Tapped empty space -> Deselect
                _selectedTile = null;
            }
        }
    }
}
