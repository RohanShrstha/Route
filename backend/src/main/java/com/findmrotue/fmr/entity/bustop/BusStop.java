package com.findmrotue.fmr.entity.bustop;

import jakarta.persistence.*;
import lombok.*;


@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class BusStop {
    @Id
    @SequenceGenerator(name = "bus_stop_sequence", sequenceName = "bus_stop_sequence", allocationSize = 1)
    @GeneratedValue(generator = "bus_stop_sequence", strategy = GenerationType.SEQUENCE)
    private Integer id;
    private String name;
    private String lng;
    private String ltd;
}
