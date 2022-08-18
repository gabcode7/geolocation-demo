import React from "react";
import MapView, { Callout, Circle, Marker } from "react-native-maps";
import { StyleSheet, Text, View, Dimensions } from "react-native";
import { useState, useEffect } from "react";
import * as Location from "expo-location";
import { GeofencingEventType } from "expo-location";
import * as TaskManager from "expo-task-manager";

export default function App() {
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      console.log("permisos foreground ", status);
      if (status == "granted") {
        let statusBack = await Location.requestBackgroundPermissionsAsync();
        console.log("status back ", statusBack.status);
        if (statusBack.status == "granted") {
          //Localizacion por primera vez
          let location = await Location.getCurrentPositionAsync({});
          console.log("location ", location);
          //Live location
          await Location.startLocationUpdatesAsync("real-time-location", {
            accuracy: Location.Accuracy.BestForNavigation,
            timeInterval: 3000,
            foregroundService: {
              notificationTitle: "BackgroundLocation Is On",
              notificationBody: "We are tracking your location",
              notificationColor: "#ffce52",
            },
          });
          await Location.startGeofencingAsync("geofencing", regions, {
            accuracy: Location.Accuracy.BestForNavigation,
            timeInterval: 3000,
            foregroundService: {
              notificationTitle: "BackgroundLocation Is On",
              notificationBody: "We are tracking your location",
              notificationColor: "#ffce52",
            },
          });
        } else {
          console.log("alto ahi esponja, dios te agarre confesado");
        }
      }
    })();
  }, []);

  //Geofencing
  const regions = [
    {
      identifier: "casa gabriel",
      latitude: -33.4568657,
      longitude: -70.5739362,
      radius: 10,
    },
  ];

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          //-33.402237150937154, -70.57834420576039
          latitude: -33.402237150937154,
          longitude: -70.57834420576039,
          latitudeDelta: 0.0322,
          longitudeDelta: 0.0221,
        }}
        showsUserLocation={true}
      >
        <Marker
          coordinate={{
            latitude: -33.402237150937154,
            longitude: -70.57834420576039,
          }}
        >
          <Callout>
            <Text> Marcador Falabella Parque Arauco!</Text>
          </Callout>
        </Marker>
        <Circle
          center={{
            latitude: -33.4568657,
            longitude: -70.5739362,
          }}
          radius={10}
        />
      </MapView>
    </View>
  );
}

TaskManager.defineTask(
  "real-time-location",
  ({ data: { locations }, error }) => {
    if (error) {
      console.log("error task manager ", error);
      return;
    }
    console.log("Received new locations", locations);
  }
);

TaskManager.defineTask(
  "geofencing",
  ({ data: { eventType, region }, error }) => {
    if (error) {
      console.log(error);
      return;
    }
    if (eventType === GeofencingEventType.Enter) {
      console.log("You've entered region:", region);
    } else if (eventType === GeofencingEventType.Exit) {
      console.log("You've left region:", region);
    }
  }
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
});
