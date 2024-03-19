package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os/exec"
	"time"

	"bufio"
	"os"
	"strconv"
	"strings"
)

type RAMData struct {
	Data string `json:"data"`
}

type Child struct {
	PID       int    `json:"pid"`
	Name      string `json:"name"`
	State     int    `json:"state"`
	ParentPID int    `json:"pidPadre"`
}

type Process struct {
	CPUTotal   int `json:"cpu_total"`
	CPUUsage   int `json:"cpu_usage"`
	CPUPorcent int `json:"cpu_porcentaje"`
	Processes  []struct {
		PID   int     `json:"pid"`
		Name  string  `json:"name"`
		User  int     `json:"user"`
		State int     `json:"state"`
		RAM   int     `json:"ram"`
		Child []Child `json:"child"`
	} `json:"processes"`
	Running  int `json:"running"`
	Sleeping int `json:"sleeping"`
	Zombie   int `json:"zombie"`
	Stopped  int `json:"stopped"`
	Total    int `json:"total"`
}

func main() {
	http.HandleFunc("/ram", ramHandler)
	http.HandleFunc("/cpu", getCpuUsage)
	http.HandleFunc("/arbol", ArbolHandler)
	http.HandleFunc("/proceso/", ArbolPIDHandler)
	http.ListenAndServe(":8080", nil)
}

func ramHandler(w http.ResponseWriter, r *http.Request) {

	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

	interval := 5
	ticker := time.NewTicker(time.Second * time.Duration(interval))
	defer ticker.Stop()

	for {
		select {
		case <-ticker.C:
			fmt.Println("DATOS OBTENIDOS DESDE EL MODULO:")
			fmt.Println("")

			cmd := exec.Command("sh", "-c", "cat /proc/ram_so1_1s2024")
			out, err := cmd.CombinedOutput()
			if err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}
			output := string(out[:])

			var data map[string]interface{}

			err = json.Unmarshal([]byte(output), &data)
			if err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}

			totalRam := data["totalRam"].(float64)
			memoriaEnUso := data["memoriaEnUso"].(float64)
			porcentaje := data["porcentaje"].(float64)
			libre := data["libre"].(float64)

			jsonData, err := json.Marshal(map[string]interface{}{
				"totalRam":     totalRam,
				"memoriaEnUso": memoriaEnUso,
				"porcentaje":   porcentaje,
				"libre":        libre,
			})
			if err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}

			w.Header().Set("Content-Type", "application/json")
			w.Write(jsonData)
			return
		}
	}
}

func getCpuUsage(w http.ResponseWriter, r *http.Request) {

	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
	file, err := os.Open("/proc/stat")
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer file.Close()

	var cpuUsage float64

	scanner := bufio.NewScanner(file)
	for scanner.Scan() {
		line := scanner.Text()
		if strings.HasPrefix(line, "cpu ") {
			fields := strings.Fields(line)
			idle, _ := strconv.ParseFloat(fields[4], 64)
			user, _ := strconv.ParseFloat(fields[1], 64)
			nice, _ := strconv.ParseFloat(fields[2], 64)
			system, _ := strconv.ParseFloat(fields[3], 64)
			iowait, _ := strconv.ParseFloat(fields[5], 64)
			irq, _ := strconv.ParseFloat(fields[6], 64)
			softirq, _ := strconv.ParseFloat(fields[7], 64)
			steal, _ := strconv.ParseFloat(fields[8], 64)
			guest, _ := strconv.ParseFloat(fields[9], 64)
			guestNice, _ := strconv.ParseFloat(fields[10], 64)
			total := (idle * 100.0) / (user + nice + system + idle + iowait + irq + softirq + steal + guest + guestNice)
			//total := user + nice + system + idle + iowait + irq + softirq + steal + guest + guestNice
			cpuUsage = 100.0 - total

			break
		}
	}

	if err := scanner.Err(); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	fmt.Fprintf(w, `{"cpu_usage": %.2f}`, cpuUsage)
}

func ArbolHandler(w http.ResponseWriter, r *http.Request) {

	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

	cmd := exec.Command("sh", "-c", "cat /proc/cpu_so1_1s2024")
	out, err := cmd.CombinedOutput()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	var process Process
	err = json.Unmarshal(out, &process)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	jsonData, err := json.Marshal(process)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.Write(jsonData)
}

func ArbolPIDHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

	pid := r.URL.Path[len("/proceso/"):]
	cmd := exec.Command("sh", "-c", fmt.Sprintf("cat /proc/cpu_so1_1s2024 | jq '.processes[] | select(.pid == %s) | .child'", pid))
	out, err := cmd.CombinedOutput()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	jsonData := fmt.Sprintf(`{"child": %s}`, string(out))

	w.Header().Set("Content-Type", "application/json")
	w.Write([]byte(jsonData))
}
