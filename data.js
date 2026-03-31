// APP_DATA is the single source of truth for all panorama scenes.
// Each scene defines its image levels, default camera view, and hotspots.
var APP_DATA = {
  "scenes": [
    {
      "id": "0-entrance",
      "name": "Entrance",
      "floor": "Ground Floor",
      "type": "Entrance",
      "tags": ["entry", "outdoor", "welcome"],
      "levels": [
        {
          "tileSize": 256,
          "size": 256,
          "fallbackOnly": true
        },
        {
          "tileSize": 512,
          "size": 512
        },
        {
          "tileSize": 512,
          "size": 1024
        },
        {
          "tileSize": 512,
          "size": 2048
        }
      ],
      "faceSize": 1344,
      "initialViewParameters": {
        "yaw": 2.9272455180089114,
        "pitch": -0.09803610225825565,
        "fov": 0.8918688079705873
      },
      "linkHotspots": [
        {
          "yaw": 3.10147907818183,
          "pitch": -0.008850261738807319,
          "rotation": 0,
          "target": "1-main-corridor"
        },
        {
          "yaw": 2.639912871171819,
          "pitch": -0.03877994813251817,
          "rotation": 4.71238898038469,
          "target": "2-sun-lounge"
        }
      ],
      "infoHotspots": []
    },
    {
      "id": "1-main-corridor",
      "name": "Main Corridor",
      "floor": "Ground Floor",
      "type": "Corridor",
      "tags": ["hallway", "navigation", "core-route"],
      "levels": [
        {
          "tileSize": 256,
          "size": 256,
          "fallbackOnly": true
        },
        {
          "tileSize": 512,
          "size": 512
        },
        {
          "tileSize": 512,
          "size": 1024
        },
        {
          "tileSize": 512,
          "size": 2048
        }
      ],
      "faceSize": 1344,
      "initialViewParameters": {
        "yaw": -0.1941401483466496,
        "pitch": 0.029616294809386545,
        "fov": 1.2959776848255018
      },
      "linkHotspots": [
        {
          "yaw": 0.8201959077669336,
          "pitch": -0.032484655924927,
          "rotation": 1.5707963267948966,
          "target": "7-kitchen"
        },
        {
          "yaw": 0.3804640292362276,
          "pitch": -0.012205191238216173,
          "rotation": 0,
          "target": "3-lounge-a"
        },
        {
          "yaw": -1.1907625789502188,
          "pitch": 0.000960468703631534,
          "rotation": 0,
          "target": "0-entrance"
        },
        {
          "yaw": 3.080823962680344,
          "pitch": -0.032536977126495614,
          "rotation": 5.497787143782138,
          "target": "8-upstairs-corridor"
        }
      ],
      "infoHotspots": []
    },
    {
      "id": "2-sun-lounge",
      "name": "Sun Lounge",
      "floor": "Ground Floor",
      "type": "Lounge",
      "tags": ["relax", "social", "daylight"],
      "levels": [
        {
          "tileSize": 256,
          "size": 256,
          "fallbackOnly": true
        },
        {
          "tileSize": 512,
          "size": 512
        },
        {
          "tileSize": 512,
          "size": 1024
        },
        {
          "tileSize": 512,
          "size": 2048
        }
      ],
      "faceSize": 1344,
      "initialViewParameters": {
        "yaw": 1.4705257937547946,
        "pitch": -0.053347038762085575,
        "fov": 1.1828363345513648
      },
      "linkHotspots": [
        {
          "yaw": 0.4926528765903022,
          "pitch": -0.094280062013814,
          "rotation": 4.71238898038469,
          "target": "3-lounge-a"
        },
        {
          "yaw": 2.4194757611648825,
          "pitch": -0.05684454124624949,
          "rotation": 1.5707963267948966,
          "target": "0-entrance"
        }
      ],
      "infoHotspots": []
    },
    {
      "id": "3-lounge-a",
      "name": "Lounge A",
      "floor": "Ground Floor",
      "type": "Lounge",
      "tags": ["meeting", "social", "seating"],
      "levels": [
        {
          "tileSize": 256,
          "size": 256,
          "fallbackOnly": true
        },
        {
          "tileSize": 512,
          "size": 512
        },
        {
          "tileSize": 512,
          "size": 1024
        },
        {
          "tileSize": 512,
          "size": 2048
        }
      ],
      "faceSize": 1344,
      "initialViewParameters": {
        "yaw": -1.938819714067261,
        "pitch": 0.18215404029367832,
        "fov": 1.2959776848255018
      },
      "linkHotspots": [
        {
          "yaw": -1.573178298814824,
          "pitch": 0.08570705505755427,
          "rotation": 7.853981633974483,
          "target": "1-main-corridor"
        },
        {
          "yaw": -2.6565635043556366,
          "pitch": 0.23678590929998222,
          "rotation": 0,
          "target": "4-lounge-b"
        }
      ],
      "infoHotspots": []
    },
    {
      "id": "4-lounge-b",
      "name": "Lounge B",
      "floor": "Ground Floor",
      "type": "Lounge",
      "tags": ["meeting", "quiet", "seating"],
      "levels": [
        {
          "tileSize": 256,
          "size": 256,
          "fallbackOnly": true
        },
        {
          "tileSize": 512,
          "size": 512
        },
        {
          "tileSize": 512,
          "size": 1024
        },
        {
          "tileSize": 512,
          "size": 2048
        }
      ],
      "faceSize": 1344,
      "initialViewParameters": {
        "yaw": -2.803826473183932,
        "pitch": 0.13608062236014007,
        "fov": 1.2959776848255018
      },
      "linkHotspots": [
        {
          "yaw": -2.5617156824446035,
          "pitch": 0.05222212284985517,
          "rotation": 0,
          "target": "3-lounge-a"
        }
      ],
      "infoHotspots": []
    },
    {
      "id": "5-lounge-c",
      "name": "Lounge C",
      "floor": "Ground Floor",
      "type": "Lounge",
      "tags": ["private", "seating", "small-group"],
      "levels": [
        {
          "tileSize": 256,
          "size": 256,
          "fallbackOnly": true
        },
        {
          "tileSize": 512,
          "size": 512
        },
        {
          "tileSize": 512,
          "size": 1024
        },
        {
          "tileSize": 512,
          "size": 2048
        }
      ],
      "faceSize": 1344,
      "initialViewParameters": {
        "pitch": 0,
        "yaw": 0,
        "fov": 1.5707963267948966
      },
      "linkHotspots": [],
      "infoHotspots": []
    },
    {
      "id": "6-queit-area",
      "name": "Queit Area",
      "floor": "Ground Floor",
      "type": "Quiet Zone",
      "tags": ["focus", "silent", "individual"],
      "levels": [
        {
          "tileSize": 256,
          "size": 256,
          "fallbackOnly": true
        },
        {
          "tileSize": 512,
          "size": 512
        },
        {
          "tileSize": 512,
          "size": 1024
        },
        {
          "tileSize": 512,
          "size": 2048
        }
      ],
      "faceSize": 1344,
      "initialViewParameters": {
        "pitch": 0,
        "yaw": 0,
        "fov": 1.5707963267948966
      },
      "linkHotspots": [],
      "infoHotspots": []
    },
    {
      "id": "7-kitchen",
      "name": "Kitchen",
      "floor": "Ground Floor",
      "type": "Service",
      "tags": ["utility", "break", "staff"],
      "levels": [
        {
          "tileSize": 256,
          "size": 256,
          "fallbackOnly": true
        },
        {
          "tileSize": 512,
          "size": 512
        },
        {
          "tileSize": 512,
          "size": 1024
        },
        {
          "tileSize": 512,
          "size": 2048
        }
      ],
      "faceSize": 1344,
      "initialViewParameters": {
        "yaw": -1.4929417588412583,
        "pitch": 0.12924241316961194,
        "fov": 1.1828363345513648
      },
      "linkHotspots": [
        {
          "yaw": -2.120781340663818,
          "pitch": 0.08802988346564611,
          "rotation": 0,
          "target": "1-main-corridor"
        }
      ],
      "infoHotspots": []
    },
    {
      "id": "8-upstairs-corridor",
      "name": "Upstairs Corridor",
      "floor": "Upstairs",
      "type": "Corridor",
      "tags": ["hallway", "upper-level", "navigation"],
      "levels": [
        {
          "tileSize": 256,
          "size": 256,
          "fallbackOnly": true
        },
        {
          "tileSize": 512,
          "size": 512
        },
        {
          "tileSize": 512,
          "size": 1024
        },
        {
          "tileSize": 512,
          "size": 2048
        }
      ],
      "faceSize": 1344,
      "initialViewParameters": {
        "yaw": -2.5076774770931785,
        "pitch": -0.025579107244949384,
        "fov": 1.1828363345513648
      },
      "linkHotspots": [
        {
          "yaw": -1.5037805700276046,
          "pitch": -0.029838368172764973,
          "rotation": 3.9269908169872414,
          "target": "1-main-corridor"
        },
        {
          "yaw": -2.779517786026707,
          "pitch": -0.001486463474643429,
          "rotation": 1.5707963267948966,
          "target": "9-room-a"
        },
        {
          "yaw": 3.0281178081605855,
          "pitch": 0.01218376383700992,
          "rotation": 4.71238898038469,
          "target": "10-room-b"
        },
        {
          "yaw": -3.106514699699563,
          "pitch": -0.03359230368882393,
          "rotation": 0,
          "target": "11-room-c"
        }
      ],
      "infoHotspots": []
    },
    {
      "id": "9-room-a",
      "name": "Room A",
      "floor": "Upstairs",
      "type": "Room",
      "tags": ["private", "room", "upper-level"],
      "levels": [
        {
          "tileSize": 256,
          "size": 256,
          "fallbackOnly": true
        },
        {
          "tileSize": 512,
          "size": 512
        },
        {
          "tileSize": 512,
          "size": 1024
        },
        {
          "tileSize": 512,
          "size": 2048
        }
      ],
      "faceSize": 1344,
      "initialViewParameters": {
        "yaw": 2.995974594138411,
        "pitch": 0.16376259110360358,
        "fov": 1.1828363345513648
      },
      "linkHotspots": [
        {
          "yaw": -2.4452018851214774,
          "pitch": 0.12029556836589883,
          "rotation": 0,
          "target": "8-upstairs-corridor"
        }
      ],
      "infoHotspots": []
    },
    {
      "id": "10-room-b",
      "name": "Room B",
      "floor": "Upstairs",
      "type": "Room",
      "tags": ["private", "room", "upper-level"],
      "levels": [
        {
          "tileSize": 256,
          "size": 256,
          "fallbackOnly": true
        },
        {
          "tileSize": 512,
          "size": 512
        },
        {
          "tileSize": 512,
          "size": 1024
        },
        {
          "tileSize": 512,
          "size": 2048
        }
      ],
      "faceSize": 1344,
      "initialViewParameters": {
        "yaw": 1.7966896664728225,
        "pitch": 0.035156676281173915,
        "fov": 0.91535400132738
      },
      "linkHotspots": [
        {
          "yaw": 1.79668974231169,
          "pitch": -0.04031180199512541,
          "rotation": 0,
          "target": "8-upstairs-corridor"
        }
      ],
      "infoHotspots": []
    },
    {
      "id": "11-room-c",
      "name": "Room C",
      "floor": "Upstairs",
      "type": "Room",
      "tags": ["private", "room", "upper-level"],
      "levels": [
        {
          "tileSize": 256,
          "size": 256,
          "fallbackOnly": true
        },
        {
          "tileSize": 512,
          "size": 512
        },
        {
          "tileSize": 512,
          "size": 1024
        },
        {
          "tileSize": 512,
          "size": 2048
        }
      ],
      "faceSize": 1344,
      "initialViewParameters": {
        "yaw": -3.1354345399704364,
        "pitch": 0.2688822909551458,
        "fov": 1.1828363345513648
      },
      "linkHotspots": [
        {
          "yaw": -2.370309384094652,
          "pitch": 0.2072160853149807,
          "rotation": 0,
          "target": "11-room-c"
        }
      ],
      "infoHotspots": []
    }
  ],
  "name": "Project Title",
  "settings": {
    // mouseViewMode "drag" means click/touch drag to rotate camera.
    "mouseViewMode": "drag",
    // autorotateEnabled toggles passive camera movement on idle.
    "autorotateEnabled": true,
    // fullscreenButton/viewControlButtons are optional built-in generator flags;
    // this project provides custom controls in index.html/index.js.
    "fullscreenButton": false,
    "viewControlButtons": false
  }
};
