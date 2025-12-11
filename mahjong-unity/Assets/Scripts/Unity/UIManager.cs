using UnityEngine;
using UnityEngine.UI;
using System;

namespace Mahjong.Unity
{
    public class UIManager : MonoBehaviour
    {
        [Header("Action Buttons")]
        public Button BtnPong;
        public Button BtnKong;
        public Button BtnChow;
        public Button BtnWin;
        public Button BtnSkip;

        public event Action<string> OnActionSelected; // "Pong", "Kong", etc.

        void Start()
        {
            // Hide all initially
            HideAllButtons();

            if(BtnPong) BtnPong.onClick.AddListener(() => OnActionSelected?.Invoke("Pong"));
            if(BtnKong) BtnKong.onClick.AddListener(() => OnActionSelected?.Invoke("Kong"));
            if(BtnChow) BtnChow.onClick.AddListener(() => OnActionSelected?.Invoke("Chow"));
            if(BtnWin) BtnWin.onClick.AddListener(() => OnActionSelected?.Invoke("Win"));
            if(BtnSkip) BtnSkip.onClick.AddListener(() => OnActionSelected?.Invoke("Skip"));
        }

        public void HideAllButtons()
        {
            if(BtnPong) BtnPong.gameObject.SetActive(false);
            if(BtnKong) BtnKong.gameObject.SetActive(false);
            if(BtnChow) BtnChow.gameObject.SetActive(false);
            if(BtnWin) BtnWin.gameObject.SetActive(false);
            if(BtnSkip) BtnSkip.gameObject.SetActive(false);
        }

        public void ShowAction(string action)
        {
            if (action == "Pong" && BtnPong) BtnPong.gameObject.SetActive(true);
            if (action == "Kong" && BtnKong) BtnKong.gameObject.SetActive(true);
            if (action == "Chow" && BtnChow) BtnChow.gameObject.SetActive(true);
            if (action == "Win" && BtnWin) BtnWin.gameObject.SetActive(true);
            
            // Always show Skip if any action is available
            if (BtnSkip) BtnSkip.gameObject.SetActive(true);
        }
    }
}
