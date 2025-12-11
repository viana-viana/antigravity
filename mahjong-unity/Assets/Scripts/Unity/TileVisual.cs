using UnityEngine;
using Mahjong.Core;
using System;

namespace Mahjong.Unity
{
    public class TileVisual : MonoBehaviour
    {
        public Tile TileData { get; private set; }
        public TextMesh Label; // Assign in Inspector
        public MeshRenderer Renderer; // Assign in Inspector

        // Event for when this tile is clicked
        public static event Action<TileVisual> OnTileClicked;

        public void Setup(Tile tile)
        {
            TileData = tile;
            UpdateVisuals();
        }

        private void UpdateVisuals()
        {
            if (Label != null)
            {
                Label.text = TileData.ToString();
                
                // Simple color coding for prototype
                if (TileData.Suit == Suit.Bamboo) Label.color = Color.green;
                else if (TileData.Suit == Suit.Character) Label.color = Color.red;
                else if (TileData.Suit == Suit.Dot) Label.color = Color.blue;
                else Label.color = Color.black;
            }
        }

        private void OnMouseDown()
        {
            OnTileClicked?.Invoke(this);
        }
    }
}
