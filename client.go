package main
 
import (
    "log"
    "net/http"
		"time"
		"io/ioutil"
)

func fetch(client *http.Client, url string) {
	resp, err := client.Get(url)
	if err != nil {
			log.Printf("Failed to get url %v", err)
			return
	}

	log.Printf("Fetched page, response code: %v", resp.StatusCode)
	defer resp.Body.Close()
	ioutil.ReadAll(resp.Body)
}

func main() {
    url := "http://localhost:8000/_healthcheck"
    waitPeriod := 500 * time.Millisecond
 
		tr := &http.Transport{
			DisableKeepAlives:   false,
		}
		client := &http.Client{Transport: tr}

    for times := 1; times < 20000; times++ {
        log.Printf("Fetch page, wait period: %d", waitPeriod)
 
				fetch(client, url)
				
        time.Sleep(waitPeriod)
        waitPeriod -= 100 * time.Microsecond
    }
}